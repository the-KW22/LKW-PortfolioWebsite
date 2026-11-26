"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";

/**
 * The main screenshot on a 3D plate: starts tilted back (about 38deg, scale 0.82) and flattens as
 * it scrolls into place (design spec 5.2). Flat and static without JS or with reduced motion.
 * Phase 5 hooks the X-ray lens onto this element ([data-xray-target]).
 */
export function Plate3D({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useMotion(
    wrapRef,
    () => {
      const plate = plateRef.current;
      const wrap = wrapRef.current;
      if (!plate || !wrap) return;
      gsap.fromTo(
        plate,
        { rotateX: 38, scale: 0.82 },
        {
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top 95%", end: "top 15%", scrub: 1 },
        },
      );
    },
    [],
  );

  return (
    <div ref={wrapRef} className="[perspective:1400px]">
      <div
        ref={plateRef}
        data-xray-target
        className="relative origin-top overflow-hidden rounded-[18px] border border-[#2a2840] bg-card shadow-[0_40px_120px_-40px_rgba(139,123,255,0.35)]"
      >
        {children}
      </div>
    </div>
  );
}
