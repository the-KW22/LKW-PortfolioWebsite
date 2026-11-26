"use client";

import { useRef, useState } from "react";
import type { ScrollTrigger } from "@/lib/gsap";
import { useFinePointer, useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { useScroll } from "@/components/motion/ScrollProvider";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { stackCopy } from "@/content/home";
import { skillGroups, usedIn } from "@/content/skills";
import { SectionHead } from "./SectionHead";
import { useTechRing } from "./useTechRing";

/**
 * 05 Tech stack. One data model, two presentations: the plain grid (always the default, and the only
 * one below 1024px, on touch and with reduced motion) and the desktop 3D ring (useTechRing). Tiles
 * are real buttons in DOM order in both. Hover, keyboard focus and tap/click show "Used in: ...".
 */
export function TechStack() {
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const ring = fine && wide && !reduced;

  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const { scrollTo } = useScroll();
  useTechRing(pinRef, stageRef, stRef, ring);

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const shown = hovered ?? pinned;
  const used = shown ? usedIn(shown) : [];

  // Keyboard users tabbing into a ring tile jump straight to the flattened grid.
  const onFocus = (e: React.FocusEvent<HTMLButtonElement>, name: string) => {
    setHovered(name);
    const st = stRef.current;
    if (st && st.progress < 0.95 && e.currentTarget.matches(":focus-visible")) {
      scrollTo(st.end, { immediate: true });
    }
  };

  return (
    <section id="stack" aria-labelledby="stack-title">
      <div
        ref={pinRef}
        className={`px-[5vw] ${ring ? "flex min-h-svh flex-col justify-center pt-[13vh] pb-[3vh]" : "pt-[16vh] pb-[14vh]"}`}
      >
        <SectionHead
          num="05"
          label="Tech stack"
          id="stack-title"
          lines={stackCopy.titleLines}
          accent="stack"
          compact={ring}
        />
        <div
          ref={stageRef}
          className="relative grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((g, row) => (
            <div key={g.id} role="group" aria-labelledby={`stack-${g.id}`}>
              <h3
                id={`stack-${g.id}`}
                data-ring-fade
                className="mono-label mb-3 border-b border-line pb-2 text-mute"
              >
                {g.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {g.skills.map((s, idx) => (
                  <li
                    key={s.name}
                    data-tile
                    data-row={row}
                    data-idx={idx}
                    data-n={g.skills.length}
                    className="will-change-transform"
                  >
                    <button
                      type="button"
                      aria-pressed={pinned === s.name}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(s.name)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={(e) => onFocus(e, s.name)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setPinned((p) => (p === s.name ? null : s.name))}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors aria-pressed:border-violet aria-pressed:bg-violet/15 ${
                        s.ai
                          ? "border-lime/50 text-lime hover:border-lime"
                          : "border-[#2e2d3a] text-[#d8d7e4] hover:border-violet"
                      }`}
                    >
                      <ScrambleText on="enter" text={s.name} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p
          aria-live="polite"
          className="sticky bottom-4 z-10 mt-8 max-w-3xl rounded-xl border border-line bg-[rgba(7,7,10,0.85)] px-4 py-3 text-sm text-mute backdrop-blur md:mt-10"
        >
          {shown ? (
            <>
              <strong className="font-semibold text-ink">{shown}</strong>
              {used.length > 0 ? (
                <>
                  {" "}
                  — <span className="text-violet">Used in:</span> {used.join(", ")}
                </>
              ) : (
                <> — {stackCopy.noMatch}</>
              )}
            </>
          ) : (
            stackCopy.hint
          )}
        </p>
      </div>
    </section>
  );
}
