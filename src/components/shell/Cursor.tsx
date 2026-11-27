"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import {
  getCursorOverride,
  subscribeCursorOverride,
  type CursorState,
} from "./cursorStore";

const INTERACTIVE = "a,button,[role=button],summary,label,[data-cursor=hover]";
// Drag cursor: a hollow ring with arrows, so it never covers the content being dragged.
export const DRAG_ARROWS = "‹ DRAG ›";
const TEXT_FIELD = "input,textarea,select,[contenteditable=true]";

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return { variant: "default" };
  if (target.closest(TEXT_FIELD)) return { variant: "hidden" };
  const marked = target.closest<HTMLElement>("[data-cursor]");
  const kind = marked?.dataset.cursor;
  if (kind === "label") return { variant: "label", label: marked?.dataset.cursorLabel ?? "" };
  if (kind === "drag") return { variant: "drag", label: DRAG_ARROWS };
  if (kind === "lens") return { variant: "lens" };
  if (kind === "hidden") return { variant: "hidden" };
  if (target.closest(INTERACTIVE)) return { variant: "hover" };
  return { variant: "default" };
}

/**
 * Custom cursor: a lime dot plus a lagging ring. Only active with a mouse or trackpad and without
 * reduced motion; otherwise it renders nothing and the native cursor stays.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [domState, setDomState] = useState<CursorState>({ variant: "default" });
  const override = useSyncExternalStore(subscribeCursorOverride, getCursorOverride, () => null);
  const state = override ?? domState;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "none" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!shown) {
        // Jump to the first position instead of sliding in from the corner.
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        show();
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const next = stateFor(e.target);
      setDomState((prev) => (prev.variant === next.variant && prev.label === next.label ? prev : next));
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      shown = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, overwrite: "auto" });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseout", onLeaveWindow);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseout", onLeaveWindow);
      root.classList.remove("has-cursor");
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" data-cursor-root>
      <div ref={dotRef} className="cursor-dot" data-variant={state.variant} />
      <div ref={ringRef} className="cursor-ring" data-variant={state.variant}>
        <span>{state.label}</span>
      </div>
    </div>
  );
}
