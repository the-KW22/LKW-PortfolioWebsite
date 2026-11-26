"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/** Pulls `ref` toward the pointer and springs it back (elastic). No-op on touch and with reduced motion. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, { x = 0.3, y = 0.35 } = {}) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fine || reduced) return;
      const move = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * x,
          y: (e.clientY - r.top - r.height / 2) * y,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)", overwrite: true });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set(el, { clearProps: "x,y" });
      };
    },
    { dependencies: [fine, reduced] },
  );
}
