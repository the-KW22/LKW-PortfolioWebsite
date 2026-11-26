"use client";

import { useRef } from "react";

type ElTag = React.ComponentType<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { whenPreloaderDone } from "@/components/shell/preloaderStore";

export interface RevealOptions {
  /** Animate matching descendants (staggered) instead of the element itself. */
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
  /** Hold the animation until the preloader has finished. */
  waitForPreloader?: boolean;
}

/** Rise-and-fade on scroll enter. Content is visible without JS; the hidden start state is applied by JS. */
export function useReveal(scope: React.RefObject<HTMLElement | null>, opts: RevealOptions = {}) {
  const { selector, y = 40, duration = 1.1, stagger = 0.08, delay = 0, start = "top 88%", waitForPreloader = false } = opts;
  useMotion(
    scope,
    (ctx) => {
      const el = scope.current;
      if (!el) return;
      const targets = selector ? gsap.utils.toArray<Element>(selector, el) : [el];
      if (!targets.length) return;
      gsap.set(targets, { y, opacity: 0 });
      const play = () =>
        ctx.add(() => {
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: "expo.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start, once: true },
          });
        });
      if (waitForPreloader) return whenPreloaderDone(play);
      play();
    },
    [selector, y, duration, stagger, delay, start, waitForPreloader],
  );
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  ...opts
}: RevealOptions & { children: React.ReactNode; as?: React.ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, opts);
  const Comp = Tag as ElTag;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
