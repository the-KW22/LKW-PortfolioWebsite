"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useScroll } from "@/components/motion/ScrollProvider";
import { peekAtlasMemory, queueAtlasCamera, rememberAtlas } from "@/components/atlas/atlasMemory";
import { setWarpBusy } from "./warpStore";

/**
 * Kinetic warp (design spec 5.1, review decision 2). A client transition layer around navigation
 * to and from /projects/[slug]. The links stay real <a> links (data-warp="enter" | "back"):
 * this provider only intercepts a plain left click. Middle-click, ctrl/cmd/shift/alt-click,
 * target=_blank, downloads, no JavaScript and direct page loads all behave normally.
 *
 * Built from DOM and CSS layers (no canvas): the project name as up to 16 outlined layers at
 * different depths, rushing toward the viewer with a perspective z move, then a violet flood. The
 * route changes at the midpoint behind the flood; once the new page is in, the overlay fades while
 * the hero title letters rise (they wait on warpStore). Back plays the same timeline in reverse
 * and restores the Atlas scroll position and camera. Only transform and opacity animate.
 *
 * Limits: navigation starts about 0.5s in, the whole thing is about 1.25s, and the hard cap below
 * forces navigation and ends the overlay no matter what. Any key, click or tap skips it; Back/
 * Forward and a hidden tab end it at once. Reduced motion: a plain crossfade.
 */

const LAYERS = 16;
const PHONE_LAYERS = 8;
/** Hard cap: navigation is forced and the overlay is released no later than this. */
const CAP_MS = 1500;
/** If the new route is still not in, fade out anyway after this long. */
const ROUTE_WAIT_MS = 6000;

type Dir = "enter" | "back";
interface Job {
  href: string;
  name: string;
  dir: Dir;
}

interface Run {
  tl: gsap.core.Timeline;
  job: Job;
  dest: string;
  navigated: boolean;
  arrived: boolean;
  finished: boolean;
  reverse: boolean;
  skipped: boolean;
  timers: number[];
}

export function WarpProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { lock, unlock, scrollTo } = useScroll();

  const overlayRef = useRef<HTMLDivElement>(null);
  const run = useRef<Run | null>(null);
  const pathRef = useRef(pathname);
  const routerRef = useRef(router);
  const reducedRef = useRef(reduced);
  const scrollApi = useRef({ lock, unlock, scrollTo });
  useEffect(() => {
    routerRef.current = router;
    reducedRef.current = reduced;
    scrollApi.current = { lock, unlock, scrollTo };
  }, [router, reduced, lock, unlock, scrollTo]);

  // The route changed: tell the running warp its destination has arrived.
  const arrive = useRef<(() => void) | null>(null);
  useEffect(() => {
    pathRef.current = pathname;
    arrive.current?.();
  }, [pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const dim = overlay.querySelector<HTMLElement>("[data-dim]")!;
    const flood = overlay.querySelector<HTMLElement>("[data-flood]")!;
    const ink = overlay.querySelector<HTMLElement>("[data-ink]")!;
    const layers = Array.from(overlay.querySelectorAll<HTMLElement>("[data-layer]"));

    const clearTimers = (r: Run) => {
      r.timers.forEach((t) => window.clearTimeout(t));
      r.timers = [];
    };

    // Release everything the warp held. Idempotent.
    const release = () => {
      const r = run.current;
      run.current = null;
      if (!r) return;
      clearTimers(r);
      r.tl.kill();
      gsap.killTweensOf([overlay, dim, flood, ink, ...layers]);
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set([dim, flood, ink, ...layers], { clearProps: "all" });
      overlay.style.visibility = "hidden";
      scrollApi.current.unlock("warp");
      detachSkip();
      arrive.current = null;
      setWarpBusy(false);
    };

    const navigate = (r: Run) => {
      if (r.navigated) return;
      r.navigated = true;
      if (r.dest === pathRef.current) {
        r.arrived = true;
        return;
      }
      routerRef.current.push(r.dest);
    };

    // The new page is in: restore the Atlas position for Back, then fade the overlay out (or play
    // the timeline in reverse for Back) while the title letters rise.
    const reveal = (r: Run) => {
      if (r.finished) return;
      r.finished = true;
      clearTimers(r);
      if (r.job.dir === "back") {
        const mem = peekAtlasMemory();
        if (mem && mem.path === r.dest) {
          // ScrollProvider resets to the top on a route change; restore after it has run.
          requestAnimationFrame(() =>
            requestAnimationFrame(() => scrollApi.current.scrollTo(mem.scrollY, { immediate: true })),
          );
        }
      }
      const done = () => {
        queueAtlasCamera(null);
        release();
      };
      setWarpBusy(false); // hero title and Atlas can start their own reveals now
      if (reducedRef.current) {
        gsap.to(overlay, { autoAlpha: 0, duration: 0.25, ease: "none", onComplete: done });
        return;
      }
      if (r.reverse) {
        r.tl.timeScale(1.5).reverse().eventCallback("onReverseComplete", done);
        return;
      }
      gsap.to(overlay, { autoAlpha: 0, duration: 0.4, ease: "power2.out", onComplete: done });
    };

    // Skip, key, click, tap: jump to fully covered, navigate now, then a short fade.
    const skip = () => {
      const r = run.current;
      if (!r || r.finished) return;
      r.tl.kill();
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(dim, { opacity: 0 });
      gsap.set(layers, { opacity: 0 });
      gsap.set(ink, { opacity: 0 });
      gsap.set(flood, { opacity: 1 });
      r.reverse = false;
      r.skipped = true;
      navigate(r);
      if (r.arrived) reveal(r);
    };

    const onSkipKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      skip();
    };
    const onSkipPointer = () => skip();
    const attachSkip = () => {
      // Added after the click that started the warp has finished, so it never skips itself.
      window.setTimeout(() => {
        if (!run.current) return;
        window.addEventListener("keydown", onSkipKey, true);
        window.addEventListener("pointerdown", onSkipPointer, true);
      }, 0);
    };
    function detachSkip() {
      window.removeEventListener("keydown", onSkipKey, true);
      window.removeEventListener("pointerdown", onSkipPointer, true);
    }

    const start = (job: Job) => {
      if (run.current) return;
      const here = pathRef.current;

      // Where "Back" will go: the Atlas place the visitor left, if known.
      let dest = job.href;
      if (job.dir === "enter") {
        // Remember the Atlas (or list) position, but never overwrite it from another case study.
        if (!here.startsWith("/projects/")) rememberAtlas(here === "/projects" ? "/projects" : here);
      } else {
        const mem = peekAtlasMemory();
        if (mem) {
          dest = mem.path;
          queueAtlasCamera(mem.cam);
        }
      }

      const phone = window.matchMedia("(max-width: 767px)").matches;
      const count = phone ? PHONE_LAYERS : LAYERS;
      const label = job.name.toUpperCase();
      layers.forEach((el, i) => {
        el.textContent = label;
        el.style.display = i < count ? "" : "none";
        el.classList.toggle("is-fill", i % 4 === 3);
      });
      ink.textContent = label;

      const r: Run = {
        tl: gsap.timeline({ paused: true }),
        job,
        dest,
        navigated: false,
        arrived: false,
        finished: false,
        reverse: job.dir === "back" && !reducedRef.current,
        skipped: false,
        timers: [],
      };
      run.current = r;
      setWarpBusy(true);
      scrollApi.current.lock("warp");
      arrive.current = () => {
        if (!r.navigated) return;
        r.arrived = true;
        // Let the timeline reach the fully covered point first (it is almost always there).
        if (r.skipped || r.tl.progress() >= 0.99) reveal(r);
      };

      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
      attachSkip();

      // Hard caps (never delay navigation past CAP_MS, never wait forever for a slow route).
      r.timers.push(window.setTimeout(() => navigate(r), CAP_MS));
      r.timers.push(window.setTimeout(() => reveal(r), ROUTE_WAIT_MS));

      const reached = () => {
        // Timeline finished covering the screen.
        if (r.arrived) reveal(r);
      };

      if (reducedRef.current) {
        r.tl.set(flood, { backgroundColor: "#07070a" }, 0);
        r.tl.fromTo(flood, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0);
        r.tl.call(() => navigate(r), undefined, 0.2);
        r.tl.call(reached, undefined, 0.2);
      } else {
        const speed = job.dir === "back" ? 2.2 : 1;
        // Layers: index 0 is nearest, higher indices sit deeper. They rush toward the camera.
        r.tl.fromTo(dim, { opacity: 0 }, { opacity: 0.88, duration: 0.2, ease: "none" }, 0);
        r.tl.set(layers, { xPercent: -50, yPercent: -50 }, 0);
        layers.slice(0, count).forEach((el, i) => {
          const from = -200 - i * 140;
          r.tl.fromTo(
            el,
            { z: from },
            {
              z: from + 3400,
              duration: 0.7,
              ease: "power2.in",
            },
            0.01 * (count - 1 - i) * (16 / count),
          );
          r.tl.fromTo(el, { opacity: 0 }, { opacity: 1 - (i / count) * 0.55, duration: 0.12, ease: "none" }, 0.01 * (count - 1 - i) * (16 / count));
        });
        // Flood: violet covers the screen, the name in dark ink scales up on top of it.
        r.tl.set(ink, { xPercent: -50, yPercent: -50 }, 0);
        r.tl.fromTo(flood, { opacity: 0 }, { opacity: 1, duration: 0.26, ease: "power2.in" }, 0.32);
        r.tl.fromTo(ink, { scale: 0.7, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.5, ease: "power2.in" }, 0.36);
        r.tl.call(() => navigate(r), undefined, 0.5);
        r.tl.set(layers, { opacity: 0 }, 0.8);
        r.tl.call(reached, undefined, 0.86);
        r.tl.timeScale(speed);
      }

      r.tl.play(0);
      // A hidden tab never runs animation frames: complete immediately (spec 5.1).
      if (document.hidden) skip();
    };

    // Delegated click: only a plain left click on a [data-warp] link to another page of this site.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const a = e.target.closest<HTMLAnchorElement>("a[data-warp]");
      if (!a) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (a.closest("[data-just-dragged=\"1\"]")) return; // the end of an Atlas drag, not a click
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathRef.current) return;
      e.preventDefault();
      if (run.current) return;
      start({
        href: url.pathname + url.search + url.hash,
        name: a.dataset.warpName || "",
        dir: a.dataset.warp === "back" ? "back" : "enter",
      });
    };
    // Capture phase: runs before Next.js <Link> handles the click itself (it would navigate at once).
    document.addEventListener("click", onClick, true);

    // Browser Back/Forward and a hidden tab end the warp immediately (the browser's own navigation wins).
    const onPop = () => release();
    const onVisibility = () => {
      if (document.hidden) skip();
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("visibilitychange", onVisibility);

    // Reveal when the timeline is already covering the screen and the route arrives later.
    const poll = () => {
      const r = run.current;
      if (r && r.arrived && !r.finished && r.tl.time() >= r.tl.duration() * 0.95) reveal(r);
    };
    gsap.ticker.add(poll);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(poll);
      release();
    };
  }, []);

  return (
    <>
      {children}
      <div ref={overlayRef} aria-hidden="true" data-warp-overlay className="warp-overlay">
        <div data-dim className="warp-dim" />
        <div className="warp-stage">
          {Array.from({ length: LAYERS }, (_, i) => (
            <span key={i} data-layer className="warp-layer" />
          ))}
        </div>
        <div data-flood className="warp-flood" />
        <span data-ink className="warp-ink" />
      </div>
    </>
  );
}
