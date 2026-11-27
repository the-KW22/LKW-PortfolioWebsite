"use client";

import { useRef } from "react";
import { useReveal } from "@/components/motion/Reveal";
import { accentItalic } from "./ui";

/** "04 — Experience" label plus a big title. `accent` is the one word shown as violet italic serif. */
export function SectionHead({
  num,
  label,
  id,
  lines,
  accent,
  compact = false,
  tight = false,
}: {
  num: string;
  label: string;
  id: string;
  lines: string[];
  accent: string;
  compact?: boolean;
  tight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { y: 60, duration: 1.2, start: "top 85%" });
  return (
    <div
      ref={ref}
      className={`flex flex-col justify-between gap-6 md:flex-row md:items-end ${tight ? "mb-[4vh] lg:mb-[2.5svh]" : compact ? "mb-[4vh]" : "mb-[9vh]"}`}
    >
      <h2
        id={id}
        className={`font-display leading-[0.9] font-black tracking-display ${
          tight
            ? "text-[clamp(44px,8vw,130px)] lg:text-[clamp(32px,min(5.2vw,7.5svh),84px)]"
            : compact ? "text-[clamp(40px,5.2vw,84px)]" : "text-[clamp(44px,8vw,130px)]"
        }`}
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {line.split(" ").map((w, i, a) => (
              <span key={i}>
                {w === accent ? <em className={accentItalic}>{w}</em> : w}
                {i < a.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <p className="mono-label text-mute">
        {num} — {label}
      </p>
    </div>
  );
}
