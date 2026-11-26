"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { markPreloaderDone } from "./preloaderStore";
import { useScroll } from "@/components/motion/ScrollProvider";

const MAX_MS = 1200; // review decision 3: hard cap
const MIN_MS = 600; // fastest the counter may run 0 -> 100, so it never just flashes

/**
 * First visit of a session only. The inline script in the root layout decides that and sets
 * data-preload="1" on <html> before first paint; the page underneath is always in the DOM, so
 * crawlers and no-JS users are never blocked (the overlay is display:none unless that attribute is set).
 * Progress is real: fonts ready + window load. It ends as soon as both are done, and at 1.2s at the latest.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const { lock, unlock } = useScroll();

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;
    if (!root || html.dataset.preload !== "1") return;

    lock("preloader");
    let fontsReady = false;
    let loaded = document.readyState === "complete";
    let cancelled = false;
    let raf = 0;
    let skip = false;
    let tl: gsap.core.Timeline | null = null;

    document.fonts.ready.then(() => (fontsReady = true));
    const onLoad = () => (loaded = true);
    // Keyboard users never wait: Tab, Enter, Space or Escape ends the loader at once.
    const onKey = (e: KeyboardEvent) => {
      if (["Tab", "Enter", " ", "Escape"].includes(e.key)) skip = true;
    };
    window.addEventListener("keydown", onKey);
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    const start = performance.now();
    const finish = () => {
      html.removeAttribute("data-preload");
      root.style.display = "none";
      markPreloaderDone();
      unlock("preloader");
    };
    const exit = () => {
      tl = gsap.timeline({ onComplete: finish });
      tl.to(root, { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.05 });
      // Let the hero start rising while the panel is still lifting.
      tl.call(markPreloaderDone, undefined, 0.5);
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const t = now - start;
      const target = (fontsReady ? 40 : 0) + (loaded ? 60 : 0);
      const paced = Math.min(target, (t / MIN_MS) * 100);
      const forced = Math.max(0, ((t - (MAX_MS - 300)) / 300) * 100);
      const value = skip ? 100 : Math.min(100, Math.floor(Math.max(paced, forced)));
      if (numRef.current) numRef.current.textContent = String(value).padStart(3, "0");
      if (value >= 100) exit();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", onKey);
      tl?.kill();
      gsap.set(root, { clearProps: "transform" });
      unlock("preloader");
    };
  }, [lock, unlock]);

  return (
    <div
      ref={rootRef}
      id="preloader"
      aria-hidden="true"
      className="fixed inset-0 z-90 hidden items-end justify-between bg-bg p-6 md:p-10"
    >
      <div className="mono-label text-mute">
        LKW22 Studio
        <br />
        Ver 3.0 — Loading
      </div>
      <div className="font-display text-[min(34vw,420px)] leading-[0.8] font-black tracking-display tabular-nums">
        <span ref={numRef}>000</span>
        <span className="text-violet">%</span>
      </div>
    </div>
  );
}
