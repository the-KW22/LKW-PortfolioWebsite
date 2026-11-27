"use client";

// The one WebGL scene on the home page. Loaded lazily by Hero (never in the initial bundle).
// Dust streams into a product blueprint (lines draw on, surfaces build). Scroll scatters it all.
// Ported from docs/mockups/hero-lab/da-particles-to-blueprint.html; data in heroBlueprint.ts.
// Draw calls: 1 points + 1 lines + 1 surfaces = 3. No postprocessing.

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  LineSegments,
  MathUtils,
  Mesh,
  Points,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { blueprintLines, blueprintSurfaces, mulberry32, sampleBlueprint } from "./heroBlueprint";

// Timeline, seconds from when the Scene mounts.
const DUST_AT = 0.3; // dust starts streaming into the blueprint
const DUST_FOR = 2.0;
const LINES_AT = 2.0; // outlines draw on
const LINES_FOR = 1.6;
const BUILD_AT = 2.9; // surfaces fade in
const BUILD_FOR = 2.4;

const FOV = 40;
const CAM_Z = 10;
const N = 30000;

const clamp01 = (x: number) => MathUtils.clamp(x, 0, 1);
const common = /* glsl */ `uniform float uPx,uTime,uScroll;`;

const pointsVert = /* glsl */ `${common} uniform float uU2,uDim;
attribute vec3 aBp; attribute vec4 aR; varying vec3 vC; varying float vA;
float ease(float x){ return x*x*(3.-2.*x); }
void main(){
  float e2=ease(clamp((uU2-aR.x*.45)/.55,0.,1.));
  float ang=aR.w*6.2832;
  vec3 p=mix(position,aBp,e2);
  p+=vec3(cos(ang+1.),sin(ang+1.),0.)*sin(3.1416*e2)*1.8;
  float amp=.3*(1.-e2)+.012+(aR.z<.1?.25:0.);
  p+=amp*vec3(sin(uTime*.5+aR.w*40.),cos(uTime*.6+aR.w*23.),sin(uTime*.4+aR.w*11.));
  p+=vec3(cos(aR.w*37.),sin(aR.w*51.),aR.x-.5)*uScroll*uScroll*(3.+9.*aR.x)+vec3(0.,-uScroll*4.5*aR.y,0.);
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=(1.1+aR.y*1.5)*uPx*(10./-mv.z);
  float isLime=aR.z>.94?1.:0.;
  vC=mix(vec3(.545,.482,1.),vec3(.776,.957,.196),isLime);
  vA=mix(.85,.85*uDim,e2);
}`;
const pointsFrag = /* glsl */ `varying vec3 vC; varying float vA; void main(){ float d=length(gl_PointCoord-.5); if(d>.5)discard; gl_FragColor=vec4(vC,smoothstep(.5,.05,d)*vA); }`;
const linesVert = /* glsl */ `attribute float aT; varying float vT; void main(){ vT=aT; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const linesFrag = /* glsl */ `${common} uniform float uLine; varying float vT;
void main(){ if(vT>uLine) discard; float f=1.-clamp(uScroll*1.6,0.,1.);
  gl_FragColor=vec4(vec3(.545,.482,1.),.5*f); }`;
const surfVert = /* glsl */ `attribute vec3 aC; attribute float aO; varying vec3 vC; varying float vO; void main(){ vC=aC; vO=aO; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const surfFrag = /* glsl */ `${common} uniform float uBuild; varying vec3 vC; varying float vO;
void main(){ float a=clamp((uBuild-vO*.6)/.4,0.,1.)*(1.-clamp(uScroll*1.6,0.,1.)); if(a<.01)discard; gl_FragColor=vec4(vC,a*.94); }`;

function buildParts() {
  const rand = mulberry32(20261127);
  const U = {
    uPx: { value: 1 },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uU2: { value: 0 },
    uDim: { value: 1 },
    uLine: { value: 0 },
    uBuild: { value: 0 },
  };
  const mk = (vertexShader: string, fragmentShader: string, additive = false) =>
    new ShaderMaterial({
      uniforms: U,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      ...(additive ? { blending: AdditiveBlending } : {}),
    });

  // Dust: start positions, blueprint targets (ambient dust gets a wide random target) and per-particle randoms.
  const dust = new Float32Array(N * 3);
  const bp = sampleBlueprint(N, rand);
  const rnd = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const ambient = rand() < 0.1;
    rnd.set([rand(), 0.3 + rand() * 0.7, ambient ? rand() * 0.1 : 0.1 + rand() * 0.9, rand()], i * 4); // z<.1 ambient, z>.94 lime
    dust.set([(rand() - 0.5) * 22, (rand() - 0.5) * 13, (rand() - 0.5) * 8], i * 3);
    if (ambient) bp.set([(rand() - 0.5) * 16, (rand() - 0.5) * 9, (rand() - 0.5) * 3], i * 3);
  }
  const pg = new BufferGeometry();
  pg.setAttribute("position", new BufferAttribute(dust, 3));
  pg.setAttribute("aBp", new BufferAttribute(bp, 3));
  pg.setAttribute("aR", new BufferAttribute(rnd, 4));
  const pMat = mk(pointsVert, pointsFrag, true);
  const points = new Points(pg, pMat);
  points.renderOrder = 2;
  points.frustumCulled = false;

  const { positions, order } = blueprintLines();
  const lg = new BufferGeometry();
  lg.setAttribute("position", new BufferAttribute(positions, 3));
  lg.setAttribute("aT", new BufferAttribute(order, 1));
  const lMat = mk(linesVert, linesFrag);
  const lines = new LineSegments(lg, lMat);
  lines.renderOrder = 1;
  lines.frustumCulled = false;

  const sg = new BufferGeometry();
  const buf = new InterleavedBuffer(blueprintSurfaces(), 7);
  sg.setAttribute("position", new InterleavedBufferAttribute(buf, 3, 0));
  sg.setAttribute("aC", new InterleavedBufferAttribute(buf, 3, 3));
  sg.setAttribute("aO", new InterleavedBufferAttribute(buf, 1, 6));
  const sMat = mk(surfVert, surfFrag);
  const surf = new Mesh(sg, sMat);
  surf.renderOrder = 0;
  surf.frustumCulled = false;

  const group = new Group();
  group.add(surf, lines, points);
  return { U, group, dispose: () => [pg, lg, sg, pMat, lMat, sMat].forEach((d) => d.dispose()) };
}

type PointerRef = { current: { x: number; y: number } };

function Scene({ pointer, onReady }: { pointer: PointerRef; onReady: () => void }) {
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const setSize = useThree((s) => s.setSize);
  const parts = useMemo(() => buildParts(), []);
  const live = useRef(parts);
  const st = useRef({ t: 0, p: 0, rx: 0, ry: 0, frames: 0 });

  useEffect(() => () => parts.dispose(), [parts]);

  // One-time remeasure: the canvas has been seen staying at 300x150 after mount.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const el = gl.domElement.parentElement;
      if (el?.clientWidth && el.clientHeight) setSize(el.clientWidth, el.clientHeight);
    }, 800);
    return () => clearTimeout(id);
  }, [gl, setSize]);

  // Framing: blueprint in the upper right, never over the bottom-left headline.
  useLayoutEffect(() => {
    const vh = 2 * CAM_Z * Math.tan(MathUtils.degToRad(FOV / 2));
    const aspect = size.width / size.height;
    const vw = vh * aspect;
    const wide = aspect > 1.1;
    const s = Math.min((wide ? vw * 0.5 : vw * 0.92) / 6.4, (vh * 0.42) / 3.4);
    const gx = wide ? vw / 2 - 3.2 * s - vw * 0.04 : 0;
    const gy = vh / 2 - 1.7 * s - vh * 0.1;
    live.current.group.scale.setScalar(s);
    live.current.group.position.set(gx, gy, 0);
  }, [size.width, size.height]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const k = st.current;
    const U = live.current.U;
    const ptr = pointer.current;
    k.t += dt;
    const t = k.t;
    const dpr = gl.getPixelRatio();

    const sy = clamp01(window.scrollY / size.height);
    k.p += (sy - k.p) * (1 - Math.exp(-dt * 6));
    k.rx = MathUtils.damp(k.rx, ptr.x * 2, 6, dt);
    k.ry = MathUtils.damp(k.ry, ptr.y * 2, 6, dt);

    U.uPx.value = dpr;
    U.uU2.value = clamp01((t - DUST_AT) / DUST_FOR);
    U.uLine.value = clamp01((t - LINES_AT) / LINES_FOR);
    U.uBuild.value = clamp01((t - BUILD_AT) / BUILD_FOR);
    U.uDim.value = 1 - 0.55 * U.uBuild.value;
    U.uTime.value = t;
    U.uScroll.value = k.p;
    live.current.group.rotation.set(-k.ry * 0.07, k.rx * 0.12, 0);

    if (k.frames < 3 && ++k.frames === 3) onReady();
  });

  return <primitive object={parts.group} />;
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

  // Pointer (the whole hero is the target) and visibility of the hero and of the tab.
  useEffect(() => {
    const el = wrap.current?.closest("section");
    if (!el) return;
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const p = pointer.current;
      p.x = (e.clientX - r.left) / r.width - 0.5;
      p.y = (e.clientY - r.top) / r.height - 0.5;
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
          camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 100 }}
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
