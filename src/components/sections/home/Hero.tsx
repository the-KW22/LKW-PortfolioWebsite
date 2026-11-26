"use client";

import "./home.css";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { useFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";
import { whenPreloaderDone } from "@/components/shell/preloaderStore";
import { Magnetic } from "@/components/motion/Magnetic";
import { heroCopy } from "@/content/home";
import { homeSections } from "@/content/sections";
import { site } from "@/content/site";
import { accentItalic, btnOutline, btnSolid } from "./ui";

/**
 * 01 Hero, CSS version (the WebGL scene is Phase 6). Perspective grid floor, glow and floating
 * chips at different depths. Cursor tilt and parallax run only with a mouse, from 768px up and
 * without reduced motion; everything else gets the same static scene.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 768px)");
  const tiltOn = fine && wide;

  // Entrance: headline lines rise from a mask once the preloader is done.
  useMotion(
    root,
    (ctx) => {
      const el = root.current;
      if (!el) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
      const rest = gsap.utils.toArray<HTMLElement>("[data-hero-in]", el);
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el);
      gsap.set(lines, { yPercent: 110 });
      gsap.set(rest, { y: 30, opacity: 0 });
      gsap.set(chips, { opacity: 0 });
      return whenPreloaderDone(() =>
        ctx.add(() => {
          gsap.to(lines, { yPercent: 0, stagger: 0.1, duration: 1.3, delay: 0.45, ease: "expo.out" });
          gsap.to(rest, { y: 0, opacity: 1, stagger: 0.1, duration: 1, delay: 0.8, ease: "expo.out" });
          gsap.to(chips, { opacity: 1, stagger: 0.08, duration: 1.4, delay: 0.9 });
        }),
      );
    },
    [],
  );

  // Scroll: headline lifts and fades, the floor flattens (rotateX 72 -> 84).
  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
    gsap.to("[data-hero-content]", { yPercent: -25, opacity: 0, ease: "none", scrollTrigger: st });
    gsap.fromTo("[data-floor]", { rotationX: 72 }, { rotationX: 84, ease: "none", scrollTrigger: st });
  }, []);

  // Cursor tilt: the scene rotates toward the cursor (about ±10° X, ±14° Y), chips shift by depth.
  useMotion(
    root,
    () => {
      const el = root.current;
      if (!el || !tiltOn) return;
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el);
      gsap.set(chips, { z: (i, t: HTMLElement) => Number(t.dataset.z) });
      const rx = gsap.quickTo(stage, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(stage, "rotationY", { duration: 0.9, ease: "power3.out" });
      const move = chips.map((c) => ({
        x: gsap.quickTo(c, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(c, "y", { duration: 0.9, ease: "power3.out" }),
        z: Number(c.dataset.z),
      }));
      const set = (nx: number, ny: number) => {
        rx(ny * -10);
        ry(nx * 14);
        move.forEach((m) => {
          m.x(nx * -m.z * 0.25);
          m.y(ny * -m.z * 0.25);
        });
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        set((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      };
      const onLeave = () => set(0, 0);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set([stage, ...chips], { clearProps: "transform" });
      };
    },
    [tiltOn],
  );

  const accent = heroCopy.accent;
  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[640px] overflow-hidden [perspective:1100px]"
    >
      <div data-stage aria-hidden="true" className="absolute inset-0 will-change-transform [transform-style:preserve-3d]">
        <div className="hero-glow pointer-events-none absolute top-[44%] left-1/2 h-[30vw] w-[70vw] -translate-x-1/2 -translate-y-1/2" />
        <div data-floor className="hero-floor absolute top-[40%] -right-1/2 -left-1/2 h-[160%]" />
        {heroCopy.chips.map((c) => (
          <div
            key={c.label}
            data-chip
            data-z={c.z}
            className={`absolute [transform-style:preserve-3d] ${c.x <= 72 && c.y <= 40 ? "" : "hidden md:block"}`}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <span
              className={`block rounded-full border px-4 py-2 text-[13px] whitespace-nowrap ${
                c.ai
                  ? "border-lime/50 bg-[rgba(17,16,24,0.85)] text-lime"
                  : "border-[#2e2d3a] bg-[rgba(17,16,24,0.85)] text-[#d8d7e4]"
              }`}
            >
              {c.ai ? "● " : ""}
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div
        data-hero-content
        className="absolute right-[5vw] bottom-[9vh] left-[5vw] [transform-style:preserve-3d]"
      >
        <p data-hero-in className="mono-label flex flex-wrap items-center gap-x-[18px] gap-y-1 text-mute">
          <b className="font-medium text-lime">●</b>
          <span>{site.name}</span>
          <span>Full-stack developer</span>
          <span>AI engineer</span>
          <span className="text-ink">{site.availabilityCopy[site.availability]}</span>
        </p>
        <h1
          id="hero-title"
          className="mt-[22px] font-display text-[clamp(40px,10.5vw,176px)] leading-[0.86] font-black tracking-[-0.055em]"
        >
          {heroCopy.headline.map((line) => (
            <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span data-line className="inline-block">
                {line.split(" ").map((w, i, a) => (
                  <span key={i}>
                    {w === accent ? <em className={accentItalic}>{w}</em> : w}
                    {i < a.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <div
          data-hero-in
          className="mt-8 flex flex-col justify-between gap-7 md:mt-[34px] md:flex-row md:items-end"
        >
          <p className="max-w-[420px] text-[17px] leading-[1.55] text-[#b9b8c6]">{heroCopy.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a href="#projects" className={btnSolid}>
                {heroCopy.ctaPrimary} <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.links.resume} className={btnOutline}>
                {heroCopy.ctaSecondary}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mono-label absolute top-1/2 right-[5vw] hidden text-mute [writing-mode:vertical-rl] md:block"
      >
        Scroll — 01 / 0{homeSections.length}
      </p>
    </section>
  );
}
