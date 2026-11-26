"use client";

import { useRef } from "react";

type ElTag = React.ComponentType<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { whenPreloaderDone } from "@/components/shell/preloaderStore";

interface Props {
  text: string;
  as?: React.ElementType;
  className?: string;
  /** "words" or "chars" become the animated units. */
  by?: "words" | "chars";
  /**
   * "rise": each unit rises out of a mask on scroll enter (or after the preloader).
   * "scrub": units light up from dim to full as you scroll (About statement).
   */
  mode?: "rise" | "scrub";
  waitForPreloader?: boolean;
  /** Words to render as the violet italic serif accent, e.g. ["build"]. */
  accent?: string[];
  stagger?: number;
}

/**
 * Split text. The full string is exposed once to assistive tech (sr-only copy); the split units are
 * aria-hidden. Without JS the text is simply visible.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  by = "words",
  mode = "rise",
  waitForPreloader = false,
  accent = [],
  stagger,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");
  const Comp = Tag as ElTag;

  useMotion(
    ref,
    (ctx) => {
      const el = ref.current;
      if (!el) return;
      const units = gsap.utils.toArray<HTMLElement>("[data-unit]", el);
      if (mode === "scrub") {
        gsap.set(units, { opacity: 0.13 });
        ctx.add(() => {
          gsap.to(units, {
            opacity: 1,
            ease: "none",
            stagger: stagger ?? 0.05,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          });
        });
        return;
      }
      gsap.set(units, { yPercent: 110 });
      const play = () =>
        ctx.add(() => {
          gsap.to(units, {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: stagger ?? (by === "chars" ? 0.03 : 0.07),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      if (waitForPreloader) return whenPreloaderDone(play);
      play();
    },
    [mode, by, waitForPreloader, stagger, text],
  );

  const maskClass = mode === "rise" ? "-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom" : "inline-block";
  return (
    <Comp ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => {
          const unitClass = accent.includes(word) ? "font-serif italic text-violet" : "";
          return (
            <span key={wi}>
              <span className={maskClass}>
                {by === "chars" ? (
                  [...word].map((ch, ci) => (
                    <span key={ci} data-unit className={`inline-block ${unitClass}`}>
                      {ch}
                    </span>
                  ))
                ) : (
                  <span data-unit className={`inline-block ${unitClass}`}>
                    {word}
                  </span>
                )}
              </span>
              {wi < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </Comp>
  );
}
