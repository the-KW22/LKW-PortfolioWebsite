"use client";

import "./home.css";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/hooks/useMotion";
import { useFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";
import { deviceCanRunHeroScene } from "@/lib/heroCapability";
import { Magnetic } from "@/components/motion/Magnetic";
import { heroCopy } from "@/content/home";
import { homeSections } from "@/content/sections";
import { site } from "@/content/site";
import { accentItalic, btnSolid } from "./ui";

/**
 * 01 Hero. The CSS scene is the SSR/phone/fallback version; HeroScene (WebGL: dust, then a product
 * blueprint with an X-ray lens) replaces it on capable desktops. The CSS scene is a perspective grid
 * floor and glow; its cursor tilt runs only with a mouse, from 768px up, without reduced motion and
 * without the WebGL scene. The tech chips are a real DOM row under the intro in every mode.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wantGL = fine && wide && !reduced;

  // WebGL scene: loaded after window load and first idle moment, only on capable devices.
  // "off" = CSS hero stays (default, SSR, phones, failures); "loading"/"ready" = canvas mounted.
  const [Scene, setScene] = useState<ComponentType<{ onReady: () => void; onFail: () => void }> | null>(null);
  const [glReady, setGlReady] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const glOn = wantGL && !glFailed && glReady;
  const tiltOn = fine && wide && !glOn;

  useEffect(() => {
    if (!wantGL || glFailed || Scene) return;
    let dead = false;
    let idle = 0;
    const start = () => {
      if (dead || !deviceCanRunHeroScene()) return;
      import("./HeroScene")
        .then((m) => !dead && setScene(() => m.default))
        .catch(() => !dead && setGlFailed(true));
    };
    const go = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 2500 })
        : window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      dead = true;
      if (idle) (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, [wantGL, glFailed, Scene]);

  // Entrance: headline lines rise from a mask on mount.
  useMotion(
    root,
    (ctx) => {
      const el = root.current;
      if (!el) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
      const rest = gsap.utils.toArray<HTMLElement>("[data-hero-in]", el);
      gsap.set(lines, { yPercent: 110 });
      gsap.set(rest, { y: 30, opacity: 0 });
      ctx.add(() => {
        gsap.to(lines, { yPercent: 0, stagger: 0.1, duration: 1.3, delay: 0.6, ease: "expo.out" });
        gsap.to(rest, { y: 0, opacity: 1, stagger: 0.1, duration: 1, delay: 0.95, ease: "expo.out" });
      });
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

  // Cursor tilt: the CSS scene rotates toward the cursor (about ±10° X, ±14° Y).
  useMotion(
    root,
    () => {
      const el = root.current;
      if (!el || !tiltOn) return;
      const stage = el.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;
      const rx = gsap.quickTo(stage, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(stage, "rotationY", { duration: 0.9, ease: "power3.out" });
      const set = (nx: number, ny: number) => {
        rx(ny * -10);
        ry(nx * 14);
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
        gsap.set(stage, { clearProps: "transform" });
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
      {wantGL && Scene && !glFailed ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{ opacity: glReady ? 1 : 0 }}
        >
          <Scene onReady={() => setGlReady(true)} onFail={() => setGlFailed(true)} />
        </div>
      ) : null}
      <div
        data-stage
        data-gl={glOn ? "on" : undefined}
        aria-hidden="true"
        className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
      >
        <div className="hero-glow pointer-events-none absolute top-[44%] left-1/2 h-[30vw] w-[70vw] -translate-x-1/2 -translate-y-1/2" />
        <div data-floor className="hero-floor absolute top-[40%] -right-1/2 -left-1/2 h-[160%]" />
      </div>

      <div
        data-hero-content
        className="absolute top-24 right-[5vw] bottom-[9vh] left-[5vw] flex flex-col justify-end [transform-style:preserve-3d]"
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
          <div className="max-w-[420px]">
            <p className="text-[17px] leading-[1.55] text-[#b9b8c6]">{heroCopy.intro}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {heroCopy.chips.map((c) => (
                <li
                  key={c.label}
                  className={`rounded-full border bg-bg/50 px-[11px] py-1.5 font-mono text-[11px] tracking-[0.04em] ${
                    c.ai ? "border-lime/45 text-lime" : "border-line text-ink"
                  }`}
                >
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a href="#projects" className={btnSolid}>
                {heroCopy.ctaPrimary} <span aria-hidden="true">↓</span>
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
