"use client";

// The one WebGL scene on the home page. Loaded lazily by Hero (never in the initial bundle).
// Draw calls: 1 glow quad + 1 grid floor + 7 chips = 9. No postprocessing (see the Phase 6 report).

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  LinearMipmapLinearFilter,
  MathUtils,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderer,
  type Group,
  type Mesh,
} from "three";
import { heroCopy } from "@/content/home";

const FOV = 45;
const CAM_Z = 8;
const PITCH = 0.083; // looks slightly down so the horizon sits about 40% from the top
const FLOOR_Y = -2.2;
const VIOLET = "vec3(0.545, 0.482, 1.0)";

const floorVert = /* glsl */ `
varying vec2 vP; varying float vDist;
void main() {
  vP = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vec4 v = viewMatrix * w;
  vDist = -v.z;
  gl_Position = projectionMatrix * v;
}`;
const floorFrag = /* glsl */ `
uniform float uTime; uniform float uFade;
varying vec2 vP; varying float vDist;
void main() {
  vec2 c = vec2(vP.x, vP.y + uTime * 0.35);
  vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
  float line = 1.0 - min(min(g.x, g.y), 1.0);
  float far = 1.0 - smoothstep(10.0, 46.0, vDist);
  float near = smoothstep(7.0, 13.0, vDist);
  float edge = 1.0 - smoothstep(18.0, 40.0, abs(vP.x));
  float a = line * 0.6 * far * near * edge * uFade;
  gl_FragColor = vec4(${VIOLET}, a);
}`;
const glowVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }`;
const glowFrag = /* glsl */ `
uniform vec2 uCenter; uniform float uFade; varying vec2 vUv;
void main() {
  vec2 d = (vUv - uCenter) / vec2(0.36, 0.17);
  float a = exp(-dot(d, d) * 1.7) * 0.34 * uFade;
  gl_FragColor = vec4(${VIOLET}, a);
}`;

type Chip = (typeof heroCopy.chips)[number];

/** Draws each chip pill (same look as the CSS chips) into a 2x canvas texture. */
function makeChipTexture(chip: Chip, family: string) {
  const dpr = 2;
  const font = `${13 * dpr}px ${family}`;
  const label = (chip.ai ? "● " : "") + chip.label;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  const w = Math.ceil(probe.measureText(label).width + 34 * dpr);
  const h = Math.ceil(38 * dpr);
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.beginPath();
  ctx.roundRect(dpr, dpr, w - 2 * dpr, h - 2 * dpr, h / 2);
  ctx.fillStyle = "rgba(17,16,24,0.85)";
  ctx.fill();
  ctx.lineWidth = dpr;
  ctx.strokeStyle = chip.ai ? "rgba(198,244,50,0.5)" : "#2e2d3a";
  ctx.stroke();
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = chip.ai ? "#c6f432" : "#d8d7e4";
  ctx.fillText(label, 17 * dpr, h / 2 + dpr * 0.5);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.anisotropy = 4;
  return { tex, w: w / dpr, h: h / dpr };
}

type PointerRef = { current: { x: number; y: number } };

function Scene({ pointer, onReady }: { pointer: PointerRef; onReady: () => void }) {
  const size = useThree((s) => s.size);
  const stage = useRef<Group>(null);
  const floor = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);
  const chipMeshes = useRef<(Mesh | null)[]>([]);
  const cur = useRef({ rx: 0, ry: 0 });
  const frames = useRef(0);
  const [chips, setChips] = useState<{ tex: CanvasTexture; w: number; h: number }[]>([]);

  const floorMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: floorVert,
        fragmentShader: floorFrag,
        uniforms: { uTime: { value: 0 }, uFade: { value: 1 } },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );
  const glowMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glowVert,
        fragmentShader: glowFrag,
        uniforms: { uCenter: { value: { x: 0.5, y: 0.56 } }, uFade: { value: 1 } },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );
  const planeGeo = useMemo(() => new PlaneGeometry(1, 1), []);
  const floorGeo = useMemo(() => new PlaneGeometry(140, 90), []);
  const glowGeo = useMemo(() => new PlaneGeometry(2, 2), []);
  const chipMats = useMemo(
    () =>
      chips.map(
        (c) =>
          new MeshBasicMaterial({ map: c.tex, transparent: true, depthWrite: false, depthTest: false, toneMapped: false }),
      ),
    [chips],
  );

  // Chip textures, drawn once fonts are ready.
  useEffect(() => {
    let dead = false;
    const made: CanvasTexture[] = [];
    document.fonts.ready.then(() => {
      if (dead) return;
      const family = getComputedStyle(document.body).fontFamily || "sans-serif";
      const list = heroCopy.chips.map((c) => makeChipTexture(c, family));
      list.forEach((l) => made.push(l.tex));
      setChips(list);
    });
    return () => {
      dead = true;
      made.forEach((t) => t.dispose());
    };
  }, []);
  useEffect(() => () => chipMats.forEach((m) => m.dispose()), [chipMats]);
  useEffect(
    () => () => {
      floorMat.dispose();
      glowMat.dispose();
      planeGeo.dispose();
      floorGeo.dispose();
      glowGeo.dispose();
    },
    [floorMat, glowMat, planeGeo, floorGeo, glowGeo],
  );

  // Place chips where the CSS chips are, at their own depth, keeping their pixel size.
  useLayoutEffect(() => {
    const tanH = Math.tan(MathUtils.degToRad(FOV / 2));
    heroCopy.chips.forEach((c, i) => {
      const m = chipMeshes.current[i];
      if (!m || !chips[i]) return;
      const zw = c.z * 0.0114;
      const dist = CAM_Z - zw;
      const halfH = dist * tanH;
      const halfW = halfH * (size.width / size.height);
      m.position.set((c.x / 100 - 0.5) * 2 * halfW, -dist * Math.tan(PITCH) + (0.5 - c.y / 100) * 2 * halfH, zw);
      const upp = (2 * halfH) / size.height;
      m.scale.set(chips[i].w * upp, chips[i].h * upp, 1);
      m.userData.baseY = m.position.y;
    });
  }, [chips, size.width, size.height]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = MathUtils.clamp(window.scrollY / size.height, 0, 1);
    const fade = 1 - p;
    const k = cur.current;
    const t = pointer.current;
    k.rx = MathUtils.damp(k.rx, t.y * MathUtils.degToRad(10), 4, dt);
    k.ry = MathUtils.damp(k.ry, t.x * MathUtils.degToRad(14), 4, dt);
    stage.current?.rotation.set(k.rx, k.ry, 0);
    if (floor.current) {
      floor.current.position.y = MathUtils.lerp(FLOOR_Y, -0.7, p * p);
    }
    const fu = (floor.current?.material as ShaderMaterial | undefined)?.uniforms;
    if (fu) {
      fu.uTime.value += dt;
      fu.uFade.value = fade;
    }
    const gu = (glow.current?.material as ShaderMaterial | undefined)?.uniforms;
    if (gu) {
      gu.uFade.value = fade;
      gu.uCenter.value.x = 0.5 + k.ry * 0.12;
      gu.uCenter.value.y = 0.56 - k.rx * 0.25 - p * 0.04;
    }
    const now = performance.now() / 1000;
    chipMats.forEach((m, i) => {
      m.opacity = fade;
      const mesh = chipMeshes.current[i];
      if (mesh) mesh.position.y = ((mesh.userData.baseY as number) ?? 0) + Math.sin(now * 0.8 + i * 1.7) * 0.05;
    });
    if (frames.current < 3 && ++frames.current === 3) onReady();
  });

  return (
    <>
      <mesh ref={glow} geometry={glowGeo} material={glowMat} renderOrder={-2} frustumCulled={false} />
      <group ref={stage}>
        <mesh
          ref={floor}
          geometry={floorGeo}
          material={floorMat}
          position={[0, FLOOR_Y, -40]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={-1}
          frustumCulled={false}
        />
        {chips.map((_, i) => (
          <mesh
            key={i}
            ref={(m) => {
              chipMeshes.current[i] = m;
            }}
            geometry={planeGeo}
            material={chipMats[i]}
            renderOrder={i}
            frustumCulled={false}
          />
        ))}
      </group>
    </>
  );
}

class Boundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroScene({ onReady, onFail }: { onReady: () => void; onFail: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);

  // Pointer (the whole hero is the target), visibility of the hero and of the tab.
  useEffect(() => {
    const el = wrap.current?.closest("section");
    if (!el) return;
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      pointer.current.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      update();
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Boundary onFail={onFail}>
        <Canvas
          dpr={[1, 2]}
          frameloop={active ? "always" : "never"}
          gl={(props) => {
            // Create the renderer ourselves so a missing or refused WebGL context falls back to the
            // CSS hero instead of throwing inside React Three Fiber's async setup.
            try {
              return new WebGLRenderer({
                ...(props as object),
                antialias: false,
                alpha: false,
                depth: false,
                stencil: false,
                powerPreference: "high-performance",
              });
            } catch (e) {
              queueMicrotask(onFail);
              throw e;
            }
          }}
          camera={{ fov: FOV, position: [0, 0, CAM_Z], rotation: [-PITCH, 0, 0], near: 0.1, far: 120 }}
          resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              onFail();
            });
          }}
          style={{ pointerEvents: "none" }}
        >
          <color attach="background" args={["#07070a"]} />
          <Scene pointer={pointer} onReady={onReady} />
        </Canvas>
      </Boundary>
    </div>
  );
}
