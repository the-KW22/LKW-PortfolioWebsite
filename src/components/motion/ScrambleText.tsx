"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useScramble } from "./useScramble";
import { useReducedMotion } from "@/hooks/useMediaQuery";

interface Props {
  text: string;
  /** "change": decode whenever `text` changes (not on first render). "enter": decode once when scrolled into view. */
  on?: "change" | "enter";
  className?: string;
}

/** Decode effect text. Screen readers get the final text; the scrambling glyphs are hidden from them. */
export function ScrambleText({ text, on = "change", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(text);
  const run = useScramble();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (on !== "change" || prev.current === text) return;
    prev.current = text;
    run(ref.current, text);
  }, [text, on, run]);

  // Reduced motion can switch on after hydration; make sure no half-decoded text is left behind.
  useEffect(() => {
    if (reduced) run(ref.current, text);
  }, [reduced, text, run]);

  useEffect(() => {
    const el = ref.current;
    if (on !== "enter" || !el || reduced) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => run(el, text),
    });
    return () => st.kill();
  }, [on, text, run, reduced]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
