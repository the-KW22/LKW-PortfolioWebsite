"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setCursorOverride } from "@/components/shell/cursorStore";
import { isTypingTarget } from "@/hooks/useShortcut";
import { useScroll } from "@/components/motion/ScrollProvider";
import { BOARD, BOARD_CENTRE, ZOOM, projectPlacements, textureItems } from "@/content/atlas";
import type { Project } from "@/content/types";
import { AtlasItems } from "./AtlasItems";

export type BoardMode = "pinned" | "inline" | "fullscreen";

interface Props {
  projects: Project[];
  mode: BoardMode;
  /** The <section> that holds the sticky stage (pinned mode only). */
  sectionRef?: RefObject<HTMLElement | null>;
  reduced: boolean;
  /** Shows a "List view" control. */
  onShowList?: () => void;
  /** Shows the Close button (fullscreen mode). */
  onClose?: () => void;
}

interface Api {
  zoomBy: (factor: number) => void;
  recenter: () => void;
}

const MINI_W = 150;
const MINI_H = (BOARD.h * MINI_W) / BOARD.w;
const SC = MINI_W / BOARD.w;
const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const miniDots = [
  ...Object.values(projectPlacements).map((p) => ({ x: p.x, y: p.y, card: true })),
  ...textureItems.map((t) => ({ x: t.at.x, y: t.at.y, card: false })),
];

/**
 * The draggable 3D board. DOM + CSS 3D only. All motion is one transform on the camera element,
 * written from a GSAP ticker callback that exists only while the board is on screen and the tab is
 * visible. Drag, inertia, tilt, zoom, focus panning, the scroll-scrubbed intro and the minimap all
 * live in the single effect below; React renders the static markup once.
 */
export function AtlasBoard({ projects, mode, sectionRef, reduced, onShowList, onClose }: Props) {
  const { scrollTo } = useScroll();
  const scrollToRef = useRef(scrollTo);
  useEffect(() => {
    scrollToRef.current = scrollTo;
  }, [scrollTo]);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const cam = camRef.current;
    if (!root || !stage || !cam) return;

    const pinned = mode === "pinned" && !!sectionRef?.current;
    const restZoom = mode === "fullscreen" ? 0.4 : ZOOM.rest;
    const minZ = mode === "fullscreen" ? 0.2 : ZOOM.min;
    const reveal = Array.from(root.querySelectorAll<HTMLElement>("[data-atlas-item]"))
      .filter((el) => el.dataset.atlasItem !== "title")
      .map((el) => ({
        el,
        d: Math.hypot(Number(el.dataset.x) - BOARD_CENTRE.x, Number(el.dataset.y) - BOARD_CENTRE.y),
        hidden: false,
      }));

    // c = camera as drawn, t = where input wants it.
    const c = { x: BOARD_CENTRE.x, y: BOARD_CENTRE.y, z: pinned ? ZOOM.introFrom : restZoom, rx: 0, ry: 0 };
    const t = { x: BOARD_CENTRE.x, y: BOARD_CENTRE.y, z: c.z };
    let vx = 0;
    let vy = 0;
    let mx = 0;
    let my = 0;
    let w = stage.clientWidth;
    let h = stage.clientHeight;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let suppressClick = false;
    let lastProgress = -1;
    let ticking = false;
    let inView = false;
    // Last written values, so the DOM is only touched when something changed.
    let wCam = "";
    let wCoords = "";
    let wZoom = "";
    let wHint = "";
    let wPos = "";
    let wSize = "";

    const setZoom = (z: number) => {
      t.z = clamp(z, minZ, ZOOM.max);
    };

    // Scroll-scrubbed intro (pinned only): the camera pulls back, the board tilts, items fade in outward.
    const st = pinned
      ? ScrollTrigger.create({
          trigger: sectionRef!.current!,
          start: "top top",
          end: "35% top",
          invalidateOnRefresh: true,
        })
      : null;
    if (st) {
      for (const r of reveal) {
        r.hidden = true;
        r.el.dataset.hidden = "";
      }
    }

    const apply = () => {
      const s = `translate3d(${w / 2}px,${h / 2}px,0) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) scale(${c.z.toFixed(4)}) translate3d(${(-c.x).toFixed(1)}px,${(-c.y).toFixed(1)}px,0)`;
      if (s !== wCam) {
        wCam = s;
        cam.style.transform = s;
      }
    };

    const readouts = () => {
      const co = `X ${String(Math.round(c.x)).padStart(4, "0")}  Y ${String(Math.round(c.y)).padStart(4, "0")}`;
      if (co !== wCoords && coordsRef.current) coordsRef.current.textContent = wCoords = co;
      const zo = `ZOOM ${Math.round(c.z * 100)}%`;
      if (zo !== wZoom && zoomRef.current) zoomRef.current.textContent = wZoom = zo;
      const hint =
        st && lastProgress < 0.99 ? "Keep scrolling" : mode === "fullscreen" ? "Drag to pan" : "Drag · Ctrl+scroll to zoom";
      if (hint !== wHint && hintRef.current) hintRef.current.textContent = wHint = hint;
      const f = frameRef.current;
      if (f) {
        const fw = (w / c.z) * SC;
        const fh = (h / c.z) * SC;
        const size = `${fw.toFixed(1)}x${fh.toFixed(1)}`;
        if (size !== wSize) {
          wSize = size;
          f.style.width = `${fw.toFixed(1)}px`;
          f.style.height = `${fh.toFixed(1)}px`;
        }
        const pos = `translate(${((c.x - w / c.z / 2) * SC).toFixed(1)}px,${((c.y - h / c.z / 2) * SC).toFixed(1)}px)`;
        if (pos !== wPos) {
          wPos = pos;
          f.style.transform = pos;
        }
      }
    };

    const clampTarget = () => {
      const nx = clamp(t.x, 0, BOARD.w);
      const ny = clamp(t.y, 0, BOARD.h);
      if (nx !== t.x) vx = 0;
      if (ny !== t.y) vy = 0;
      t.x = nx;
      t.y = ny;
    };

    const tick = (_time: number, dtMs: number) => {
      const f = clamp(dtMs / 16.667, 0.5, 3);
      const smooth = reduced ? 1 : 1 - Math.pow(1 - 0.12, f);

      if (!dragging && (vx !== 0 || vy !== 0)) {
        t.x += vx * f;
        t.y += vy * f;
        const decay = Math.pow(0.93, f);
        vx *= decay;
        vy *= decay;
        if (Math.abs(vx) < 0.01) vx = 0;
        if (Math.abs(vy) < 0.01) vy = 0;
        clampTarget();
      }

      let ip = 1;
      if (st) {
        const p = st.progress;
        ip = ease3(p);
        if (p !== lastProgress) {
          lastProgress = p;
          t.z = ZOOM.introFrom + (ZOOM.rest - ZOOM.introFrom) * ip;
          const radius = ip * 1800;
          for (const r of reveal) {
            const hide = r.d > radius + 60;
            if (hide !== r.hidden) {
              r.hidden = hide;
              if (hide) r.el.dataset.hidden = "";
              else delete r.el.dataset.hidden;
            }
          }
        }
      } else lastProgress = 1;

      c.x += (t.x - c.x) * smooth;
      c.y += (t.y - c.y) * smooth;
      c.z += (t.z - c.z) * smooth;

      const wantRx = reduced ? 0 : 14 * (st ? ip : 0) - my * 12 + clamp(vy * 1.2, -8, 8);
      const wantRy = reduced ? 0 : mx * 16 + clamp(-vx * 1.2, -10, 10);
      const tilt = 1 - Math.pow(1 - 0.07, f);
      c.rx += (wantRx - c.rx) * tilt;
      c.ry += (wantRy - c.ry) * tilt;
      if (Math.abs(wantRx - c.rx) < 0.005) c.rx = wantRx;
      if (Math.abs(wantRy - c.ry) < 0.005) c.ry = wantRy;

      apply();
      readouts();
    };

    // The ticker runs only while the board is in view and the tab is visible.
    const sync = () => {
      const want = inView && !document.hidden;
      if (want && !ticking) {
        ticking = true;
        gsap.ticker.add(tick);
      } else if (!want && ticking) {
        ticking = false;
        gsap.ticker.remove(tick);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(root);
    document.addEventListener("visibilitychange", sync);

    const ro = new ResizeObserver(() => {
      w = stage.clientWidth;
      h = stage.clientHeight;
      if (!ticking) {
        apply();
        readouts();
      }
    });
    ro.observe(stage);

    // ---- input ----
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const now = performance.now();
      const frames = Math.max(0.5, (now - lastT) / 16.667);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      const before = moved;
      moved += Math.abs(dx) + Math.abs(dy);
      if (before <= 6 && moved > 6) setCursorOverride({ variant: "label", label: "DRAG" });
      t.x -= dx / c.z;
      t.y -= dy / c.z;
      // Release velocity in board px per 60fps frame, lightly smoothed.
      vx = vx * 0.5 + (-dx / c.z / frames) * 0.5;
      vy = vy * 0.5 + (-dy / c.z / frames) * 0.5;
      clampTarget();
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!dragging) return;
      dragging = false;
      suppressClick = moved > 6;
      setTimeout(() => (suppressClick = false), 0);
      if (suppressClick) setCursorOverride(null);
      if (reduced || performance.now() - lastT > 70) {
        vx = 0;
        vy = 0;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = performance.now();
      vx = 0;
      vy = 0;
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };
    // A drag must never open a card: swallow the click that follows it.
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onHover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced) return;
      const r = stage.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // plain wheel keeps scrolling the page
      e.preventDefault();
      setZoom(t.z * Math.exp(-e.deltaY * 0.004));
    };
    const onDragStart = (e: Event) => e.preventDefault();

    const api: Api = {
      zoomBy: (factor) => setZoom(t.z * factor),
      recenter: () => {
        t.x = BOARD_CENTRE.x;
        t.y = BOARD_CENTRE.y;
        setZoom(restZoom);
        vx = 0;
        vy = 0;
      },
    };
    apiRef.current = api;

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
      const step = 160 / c.z;
      switch (e.key) {
        case "+":
        case "=":
          api.zoomBy(1.25);
          break;
        case "-":
        case "_":
          api.zoomBy(1 / 1.25);
          break;
        case "0":
          api.recenter();
          break;
        case "ArrowLeft":
          t.x -= step;
          break;
        case "ArrowRight":
          t.x += step;
          break;
        case "ArrowUp":
          t.y -= step;
          break;
        case "ArrowDown":
          t.y += step;
          break;
        default:
          return;
      }
      clampTarget();
      e.preventDefault();
    };

    // Focusing a card with the keyboard pans the board to it.
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      const item = target?.closest<HTMLElement>("[data-card]");
      if (!item || !target?.matches(":focus-visible")) return;
      if (st) {
        // Browsers scroll a focused element into view using its (transformed) box, which can throw
        // the page far past the pinned stage. Keep the page inside the pinned range, past the intro.
        const sectionEl = sectionRef!.current!;
        const clampScroll = () => {
          const lo = st.end;
          const hi = Math.max(lo, st.start + sectionEl.offsetHeight - window.innerHeight);
          const y = window.scrollY;
          const ny = clamp(y, lo, hi);
          if (Math.abs(ny - y) > 1) scrollToRef.current(ny, { immediate: true });
        };
        clampScroll();
        requestAnimationFrame(() => {
          clampScroll();
          requestAnimationFrame(clampScroll);
        });
      }
      t.x = Number(item.dataset.x);
      t.y = Number(item.dataset.y);
      if (t.z < 0.6) t.z = 0.8;
      vx = 0;
      vy = 0;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onHover, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("click", onClickCapture, true);
    stage.addEventListener("dragstart", onDragStart);
    stage.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("keydown", onKey);
    root.addEventListener("focusin", onFocusIn);

    apply();
    readouts();

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      st?.kill();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onHover);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("click", onClickCapture, true);
      stage.removeEventListener("dragstart", onDragStart);
      stage.removeEventListener("wheel", onWheel);
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("focusin", onFocusIn);
      setCursorOverride(null);
      apiRef.current = null;
    };
  }, [mode, reduced, sectionRef]);

  return (
    <div ref={rootRef} className="atlas-root relative h-full w-full" data-atlas-mode={mode}>
      <p id={`atlas-help-${mode}`} className="sr-only">
        Map of {projects.length} personal projects. Press Tab to move between project links; the map pans to the focused
        project. Use the plus and minus buttons or keys to zoom, the arrow keys to pan, and 0 or Recenter to reset.
        Plain scrolling moves the page. A list view is also available.
      </p>
      <div
        ref={stageRef}
        role="group"
        aria-label="Project atlas: a draggable map of personal projects"
        aria-describedby={`atlas-help-${mode}`}
        className="atlas-stage"
        data-cursor="label"
        data-cursor-label="DRAG"
      >
        <div ref={camRef} className="atlas-cam">
          <div className="atlas-board" style={{ width: BOARD.w, height: BOARD.h }}>
            <AtlasItems projects={projects} />
          </div>
        </div>
      </div>

      <div className="atlas-hud-bl mono-label" aria-hidden="true">
        <span ref={coordsRef}>X 1800 Y 1200</span>
        <span ref={zoomRef}>ZOOM 100%</span>
        <span ref={hintRef} className="hidden text-lime sm:inline">
          Drag
        </span>
      </div>

      <div className="atlas-hud-br">
        <div className="atlas-controls">
          <button type="button" className="atlas-pill" aria-label="Zoom in" onClick={() => apiRef.current?.zoomBy(1.25)}>
            +
          </button>
          <button type="button" className="atlas-pill" aria-label="Zoom out" onClick={() => apiRef.current?.zoomBy(1 / 1.25)}>
            −
          </button>
          <button type="button" className="atlas-pill" onClick={() => apiRef.current?.recenter()}>
            Recenter
          </button>
          {onShowList && (
            <button type="button" className="atlas-pill" onClick={onShowList}>
              List view
            </button>
          )}
        </div>
        <div className="atlas-mini" aria-hidden="true" style={{ width: MINI_W, height: MINI_H }}>
          {miniDots.map((d, i) => (
            <i key={i} className={d.card ? "is-card" : ""} style={{ left: d.x * SC, top: d.y * SC }} />
          ))}
          <div ref={frameRef} className="atlas-mini-frame" />
        </div>
      </div>

      {mode === "fullscreen" && onClose && (
        <button type="button" data-atlas-close className="atlas-pill atlas-close" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
}
