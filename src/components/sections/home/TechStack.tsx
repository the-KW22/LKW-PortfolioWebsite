"use client";

import { useRef } from "react";
import type { ScrollTrigger } from "@/lib/gsap";
import { useFinePointer, useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { stackCopy } from "@/content/home";
import { skillGroups } from "@/content/skills";
import { SectionHead } from "./SectionHead";
import { useTechRing } from "./useTechRing";

/**
 * 05 Tech stack. One data model, two presentations: the plain grid (always the default, and the only
 * one below 1024px, on touch and with reduced motion) and the desktop 3D ring (useTechRing). Tiles
 * are plain labelled list items in DOM order in both; they are not interactive (owner decision,
 * 2026-11-26), so there are no tab stops inside the ring.
 */
export function TechStack() {
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const ring = fine && wide && !reduced;

  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  useTechRing(pinRef, stageRef, stRef, ring);

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
                    <span
                      className={`block rounded-full border px-4 py-2 text-sm ${
                        s.ai ? "border-lime/50 text-lime" : "border-[#2e2d3a] text-[#d8d7e4]"
                      }`}
                    >
                      <ScrambleText on="enter" text={s.name} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
