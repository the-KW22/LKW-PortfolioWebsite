"use client";

import { useEffect, useRef } from "react";
import type { XrayLayer } from "@/content/types";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import { useXrayOn } from "./xrayStore";

/** Lens radius on a mouse device: matches the 260px cursor ring (the `lens` cursor variant). */
const LENS_R = 130;
/** Fixed lens radius on touch, smaller so it fits a phone screenshot. */
const TOUCH_R = 76;

interface Lens {
  x: number;
  y: number;
  r: number;
}

/**
 * One X-ray-capable screenshot: the real picture on top, a "bones" layer (lime grid, dashed boxes,
 * mono notes) revealed through a circular clip-path (design spec 5.3).
 * - Mouse: a lens follows the pointer while it is over the picture. The top-bar toggle or the X
 *   key opens the bones over the whole picture with a circle wipe.
 * - Touch: the toggle shows a fixed-radius lens that follows a finger drag on the lens itself;
 *   the page keeps scrolling everywhere else.
 * - Reduced motion: no wipe or growth, the layer simply shows and hides.
 * Only clip-path changes, driven from one rAF write per change (no layout reads while moving).
 * The bones are decorative (aria-hidden): the same text is in <XrayNotes>.
 */
export function XrayFrame({ layer, children }: { layer: XrayLayer; children: React.ReactNode }) {
  const on = useXrayOn();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const bonesRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const apply = useRef<(() => void) | null>(null);
  const inputs = useRef({ on, fine, reduced, hover: false });

  useEffect(() => {
    const frame = frameRef.current;
    const bones = bonesRef.current;
    const ring = ringRef.current;
    if (!frame || !bones) return;
    const lens: Lens = { x: 0, y: 0, r: 0 };
    let tween: gsap.core.Tween | null = null;
    let raf = 0;
    let dragging = false;
    let hasPointer = false;

    const paint = () => {
      raf = 0;
      bones.style.visibility = lens.r > 0.5 ? "visible" : "hidden";
      bones.style.clipPath = `circle(${lens.r.toFixed(1)}px at ${lens.x.toFixed(1)}px ${lens.y.toFixed(1)}px)`;
      if (ring) ring.style.transform = `translate3d(${(lens.x - TOUCH_R).toFixed(1)}px,${(lens.y - TOUCH_R).toFixed(1)}px,0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const cover = () => Math.hypot(frame.offsetWidth, frame.offsetHeight) / 2 + 8;
    const centre = () => ({ x: frame.offsetWidth / 2, y: frame.offsetHeight / 2 });

    // Decide what the lens should be doing and tween towards it.
    const sync = () => {
      const { on: open, fine: mouse, reduced: still, hover } = inputs.current;
      let target: Lens;
      if (open && mouse) {
        target = { ...centre(), r: cover() };
      } else if (open) {
        if (!lens.r) {
          const c = centre();
          lens.x = c.x;
          lens.y = c.y;
        }
        target = { x: lens.x, y: lens.y, r: TOUCH_R };
      } else if (mouse && hover && hasPointer) {
        target = { x: lens.x, y: lens.y, r: LENS_R };
      } else {
        target = { x: lens.x, y: lens.y, r: 0 };
      }
      tween?.kill();
      const wipe = open && mouse;
      if (still || (target.r === lens.r && target.x === lens.x && target.y === lens.y)) {
        Object.assign(lens, target);
        schedule();
        return;
      }
      tween = gsap.to(lens, {
        ...target,
        duration: wipe ? 0.9 : open || !hover ? 0.45 : 0.22,
        ease: wipe ? "power3.inOut" : "power3.out",
        onUpdate: schedule,
        overwrite: true,
      });
    };
    apply.current = sync;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hasPointer = true;
      if (inputs.current.on) return; // the wipe covers the whole picture
      lens.x = e.offsetX;
      lens.y = e.offsetY;
      if (!tween?.isActive()) schedule();
      else sync();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      inputs.current.hover = true;
      lens.x = e.offsetX;
      lens.y = e.offsetY;
      hasPointer = true;
      sync();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      inputs.current.hover = false;
      sync();
    };
    const hit = frame.querySelector<HTMLElement>("[data-xray-hit]");
    hit?.addEventListener("pointerenter", onEnter);
    hit?.addEventListener("pointermove", onMove, { passive: true });
    hit?.addEventListener("pointerleave", onLeave);

    // Touch: drag the lens itself. Deltas are divided by the plate's current scale (the 3D plate
    // starts scaled down), and the lens is kept inside the picture.
    let sx = 0;
    let sy = 0;
    let lx = 0;
    let ly = 0;
    let scale = 1;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      tween?.kill();
      try {
        ring?.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone (synthetic or cancelled): the drag still works from window moves */
      }
      sx = e.clientX;
      sy = e.clientY;
      lx = lens.x;
      ly = lens.y;
      scale = frame.offsetWidth ? frame.getBoundingClientRect().width / frame.offsetWidth : 1;
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      lens.x = Math.min(frame.offsetWidth, Math.max(0, lx + (e.clientX - sx) / scale));
      lens.y = Math.min(frame.offsetHeight, Math.max(0, ly + (e.clientY - sy) / scale));
      schedule();
    };
    const onUp = () => {
      dragging = false;
    };
    ring?.addEventListener("pointerdown", onDown);
    ring?.addEventListener("pointermove", onDrag);
    ring?.addEventListener("pointerup", onUp);
    ring?.addEventListener("pointercancel", onUp);

    // Keep the open wipe covering the picture if it is resized.
    const ro = new ResizeObserver(() => {
      if (inputs.current.on && inputs.current.fine) sync();
    });
    ro.observe(frame);

    sync();
    return () => {
      tween?.kill();
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      hit?.removeEventListener("pointerenter", onEnter);
      hit?.removeEventListener("pointermove", onMove);
      hit?.removeEventListener("pointerleave", onLeave);
      ring?.removeEventListener("pointerdown", onDown);
      ring?.removeEventListener("pointermove", onDrag);
      ring?.removeEventListener("pointerup", onUp);
      ring?.removeEventListener("pointercancel", onUp);
      apply.current = null;
    };
  }, []);

  // Inputs that change after mount: re-run the decision.
  useEffect(() => {
    inputs.current.on = on;
    inputs.current.fine = fine;
    inputs.current.reduced = reduced;
    apply.current?.();
  }, [on, fine, reduced]);

  return (
    <div ref={frameRef} className="xray-frame">
      {children}
      <div ref={bonesRef} aria-hidden="true" className="xray-bones">
        <span className="xray-tag">X-RAY · {layer.title} · DRAFT NOTES</span>
        {layer.boxes.map((b, i) => (
          <div key={i} className="xray-box" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}>
            <span className="xray-label">{b.label}</span>
          </div>
        ))}
        {layer.notes.map((note, i) => (
          <p key={i} className="xray-note" data-kind={note.kind} style={{ left: `${note.x}%`, top: `${note.y}%` }}>
            {note.text}
          </p>
        ))}
      </div>
      {/* Mouse hit layer: gives the lens exact local coordinates even on the tilted 3D plate. */}
      <div
        data-xray-hit
        aria-hidden="true"
        data-cursor={fine && !on ? "lens" : undefined}
        className={fine ? "absolute inset-0 z-20" : "hidden"}
      />
      {/* Touch lens: a drag handle that never covers more than itself, so the page still scrolls. */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="xray-ring"
        style={{ width: TOUCH_R * 2, height: TOUCH_R * 2, display: on && !fine ? "block" : "none" }}
      />
    </div>
  );
}
