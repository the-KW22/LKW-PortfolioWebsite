"use client";

import "../sections/home/home.css";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { useScroll } from "@/components/motion/ScrollProvider";
import { site } from "@/content/site";

/** Footer: giant gradient wordmark rising with scroll, copyright, past versions, back to top. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useScroll();
  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      "[data-wordmark]",
      { yPercent: 40, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
      },
    );
  }, []);

  return (
    <footer ref={ref} className="overflow-hidden border-t border-line px-[5vw] pt-[8vh] pb-6">
      <div
        data-wordmark
        aria-hidden="true"
        className="footer-wordmark text-center font-display text-[23vw] leading-[0.78] font-black tracking-[-0.07em]"
      >
        LKW22
      </div>
      <div className="mono-label mt-[30px] flex flex-wrap items-center justify-between gap-5 text-mute">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>
          Past versions:{" "}
          {site.pastVersions.map((v, i) => (
            <span key={v.href}>
              {i > 0 ? " · " : null}
              {/* Plain <a>: separate documents, not routes of this app. */}
              <a href={v.href} className="text-ink transition-colors hover:text-lime">
                {v.label}
              </a>
            </span>
          ))}
        </span>
        {/* TODO(Phase 6): add "and Three.js" once the WebGL hero ships. */}
        <span>Built with Next.js and GSAP</span>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(0);
          }}
          className="text-ink transition-colors hover:text-lime"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
