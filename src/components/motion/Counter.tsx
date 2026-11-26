"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  from?: number;
  className?: string;
}

/** Counts up when scrolled into view. The final value is the server-rendered text, so it is correct without JS. */
export function Counter({ value, prefix = "", suffix = "", from = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotion(
    ref,
    (ctx) => {
      const el = ref.current;
      if (!el) return;
      const state = { v: from };
      const write = () => {
        el.textContent = `${prefix}${Math.round(state.v)}${suffix}`;
      };
      write();
      ctx.add(() => {
        gsap.to(state, {
          v: value,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: write,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      return () => {
        el.textContent = `${prefix}${value}${suffix}`;
      };
    },
    [value, prefix, suffix, from],
  );
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
