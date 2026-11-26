"use client";

import { Counter } from "@/components/motion/Counter";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { SplitText } from "@/components/motion/SplitText";
import { Tilt } from "@/components/motion/Tilt";
import { homeSections } from "@/content/sections";

/**
 * PLACEHOLDER (Phase 1, remove in Phase 2): exercises each shared motion primitive and the cursor
 * labels so the owner can try them. Contains no portfolio facts; the only number is the section count.
 */
export function MotionKit() {
  return (
    <Reveal selector="[data-kit]" stagger={0.1} waitForPreloader className="mt-12 grid max-w-4xl gap-6 md:grid-cols-4">
      <div data-kit className="rounded-2xl border border-line bg-card p-5">
        <p className="mono-label mb-3 text-mute">SplitText</p>
        <SplitText as="p" text="Rise from a mask" by="chars" className="text-2xl font-extrabold" />
      </div>
      <div data-kit className="rounded-2xl border border-line bg-card p-5">
        <p className="mono-label mb-3 text-mute">Counter</p>
        <Counter value={homeSections.length} className="text-5xl font-black" />
        <p className="mt-1 text-sm text-mute">sections on this page</p>
      </div>
      <div data-kit className="rounded-2xl border border-line bg-card p-5">
        <p className="mono-label mb-3 text-mute">Scramble</p>
        <ScrambleText on="enter" text="Decode me" className="text-2xl font-extrabold" />
      </div>
      <Tilt data-kit className="rounded-2xl border border-line bg-card p-5">
        <p className="mono-label mb-3 text-mute">Tilt</p>
        <p className="text-sm text-mute">Move the pointer over this card.</p>
      </Tilt>
      <div data-kit className="flex items-center gap-4 md:col-span-2">
        <Magnetic>
          <a href="#about" className="inline-flex h-[52px] items-center rounded-full bg-lime px-6 text-sm font-semibold text-[#0c0e05]">
            Magnetic button
          </a>
        </Magnetic>
      </div>
      <div
        data-kit
        data-cursor="label"
        data-cursor-label="DRAG"
        className="grid h-24 place-items-center rounded-2xl border border-dashed border-line text-sm text-mute md:col-span-2"
      >
        Cursor label zone (DRAG)
      </div>
    </Reveal>
  );
}
