"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScroll } from "@/components/motion/ScrollProvider";
import type { ExperienceProject } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");
/** Scroll distance (as % of the viewport) the pinned case-file spends on each project. */
const SCROLL_PER_PROJECT = 70;

/**
 * NM Media project case-file. On desktop with motion allowed the block pins and scroll swaps the
 * active project (rail on the left, full detail on the right). On mobile, with reduced motion, or
 * before JS runs, every project is a plain stacked card and the rail is hidden, so nothing is lost.
 * The pinned mode is switched on by `data-pinned` on the stage, set only while the media query matches.
 */
export function ProjectCaseFile({ projects }: { projects: ExperienceProject[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useScroll();
  const n = projects.length;

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        el.dataset.pinned = "true";
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 14%",
          end: `+=${n * SCROLL_PER_PROJECT}%`,
          pin: true,
          // Measured before the timeline line and header ruler, so they see the pin spacer's height.
          refreshPriority: 1,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        trigger.current = st;
        return () => {
          st.kill();
          trigger.current = null;
          delete el.dataset.pinned;
          setActive(0);
        };
      });
      return () => mm.revert();
    },
    { scope: stage, dependencies: [n] },
  );

  const go = (i: number) => {
    const st = trigger.current;
    if (st) scrollTo(st.start + ((st.end - st.start) * (i + 0.5)) / n);
  };

  return (
    <div
      ref={stage}
      className="group mt-6 grid gap-4 md:grid-cols-[210px_1fr] md:gap-8 data-[pinned=true]:min-h-[58svh]"
    >
      <ol className="hidden flex-col gap-1 self-start border-l border-line group-data-[pinned=true]:flex">
        {projects.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === active ? "true" : undefined}
              data-cursor="hover"
              className={`-ml-px w-full border-l-2 py-2 pl-4 text-left text-sm leading-snug transition-colors ${
                i === active ? "border-lime text-ink" : "border-transparent text-mute hover:text-ink"
              }`}
            >
              <span className={`mono-label mb-0.5 block ${i === active ? "text-lime" : ""}`}>{pad(i + 1)}</span>
              {p.name}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 group-data-[pinned=true]:gap-0">
        {projects.map((p, i) => (
          <article
            key={p.id}
            data-active={i === active}
            className="rounded-xl border border-line bg-[#0b0b10] px-5 py-5 transition-[opacity,translate] duration-500 group-data-[pinned=true]:col-start-1 group-data-[pinned=true]:row-start-1 group-data-[pinned=true]:px-8 group-data-[pinned=true]:py-7 group-data-[pinned=true]:data-[active=false]:pointer-events-none group-data-[pinned=true]:data-[active=false]:translate-y-4 group-data-[pinned=true]:data-[active=false]:opacity-0"
          >
            <p className="mono-label text-mute">
              Project {pad(i + 1)} / {pad(n)}
            </p>
            <h4 className="mt-2 font-display text-[clamp(22px,2.4vw,38px)] leading-none font-extrabold tracking-[-0.03em]">
              {p.name}
            </h4>
            {p.highlights?.map((h) => (
              <p key={h.value} className="mt-5 text-[13.5px] leading-normal text-lime">
                <strong className="block font-display text-[clamp(44px,5.5vw,88px)] leading-none font-black tracking-[-0.04em]">
                  {h.value}
                </strong>
                {h.label}
              </p>
            ))}
            <ul className="mt-5 grid max-w-2xl gap-2.5 text-[15px] leading-normal text-[#b9b8c6]">
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech used">
              {p.stack.map((t) => (
                <li
                  key={t.name}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
                    t.ai ? "border-lime/50 text-lime" : "border-[#2a2935] text-[#b9b8c6]"
                  }`}
                >
                  {t.name}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
