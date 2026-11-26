"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Tilts toward the pointer in 3D and exposes --mx / --my (pointer position in %) for a moving
 * light, e.g. background: radial-gradient(circle at var(--mx) var(--my), ...). No-op on touch and
 * with reduced motion.
 */
export function useTilt(ref: React.RefObject<HTMLElement | null>, max = 10) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fine || reduced) return;
      const move = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        gsap.to(el, {
          rotationY: (px - 0.5) * 2 * max,
          rotationX: (0.5 - py) * 2 * max,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      };
      const leave = () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "expo.out", overwrite: "auto" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set(el, { clearProps: "transform" });
      };
    },
    { dependencies: [fine, reduced, max] },
  );
}

export function Tilt({
  children,
  className,
  max,
  ...rest
}: { max?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, max);
  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }} {...rest}>
      {children}
    </div>
  );
}
