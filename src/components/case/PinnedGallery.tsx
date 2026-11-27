"use client";

import { useRef } from "react";
import type { GalleryScreen } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { MediaView } from "./MediaView";

/**
 * Horizontal gallery. By default (no JS, phones, reduced motion) it is a normal swipe/scroll list
 * with scroll snapping. On wider screens without reduced motion it is pinned and scrubbed
 * sideways by vertical scroll. Everything JS creates is reverted by the matchMedia context.
 */
export function PinnedGallery({ screens, name }: { screens: GalleryScreen[]; name: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!root || !viewport || !track) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(viewport, { overflow: "hidden", scrollSnapType: "none" });
        viewport.setAttribute("tabindex", "-1"); // the page scroll drives it; no separate scroller to focus
        viewport.removeAttribute("data-lenis-prevent-wheel"); // pinned: the wheel must scroll the page, not be swallowed
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Measure pins before other triggers (the header ruler) so their positions include the pin spacing.
            refreshPriority: 1,
            onUpdate: (self) => {
              const i = Math.min(screens.length, Math.floor(self.progress * screens.length) + 1);
              if (countRef.current) countRef.current.textContent = String(i).padStart(2, "0");
            },
          },
        });
        tl.to(track, { x: () => -distance() }, 0);
        tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1 }, 0);
        return () => {
          viewport.setAttribute("tabindex", "0");
          viewport.setAttribute("data-lenis-prevent-wheel", "");
          viewport.scrollLeft = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [screens.length], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="gallery"
      data-case-section
      data-case-label="Screens"
      aria-label={`${name} screens`}
      className="flex min-h-svh flex-col justify-center gap-8 py-[10vh] md:pt-40 md:pb-12"
    >
      <div className="flex items-end justify-between gap-6 px-[5vw]">
        <h2 className="font-display text-[clamp(32px,5vw,72px)] leading-none font-black tracking-display">
          The <em className="font-serif font-normal text-violet">screens</em>
        </h2>
        <p className="mono-label text-mute tabular-nums" aria-hidden="true">
          <span ref={countRef} className="text-ink">
            01
          </span>{" "}
          / {String(screens.length).padStart(2, "0")}
        </p>
      </div>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-label={`${name} screens, scrollable`}
        data-lenis-prevent-wheel
        className="snap-x snap-mandatory overflow-x-auto rounded-sm px-[5vw] pb-4 [scrollbar-width:thin]"
      >
        <ul ref={trackRef} className="flex w-max gap-5 md:gap-8">
          {screens.map((s, i) => (
            <li key={i} className="w-[82vw] shrink-0 snap-center md:w-[min(62vw,980px)]">
              <figure>
                <div className="overflow-hidden rounded-2xl border border-[#2a2840] bg-card">
                  <MediaView media={s.media} label={name} sizes="(min-width: 768px) 62vw, 82vw" />
                </div>
                <figcaption className="mono-label mt-3 flex gap-3 text-mute">
                  <span className="text-ink">{String(i + 1).padStart(2, "0")}</span>
                  {s.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="mx-[5vw] hidden h-px bg-line md:block">
        <span ref={barRef} className="block h-px origin-left scale-x-100 bg-violet" />
      </div>
    </section>
  );
}
