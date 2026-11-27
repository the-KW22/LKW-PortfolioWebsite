"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";

interface ScrollOptions {
  offset?: number;
  immediate?: boolean;
}

interface ScrollApi {
  /** Stop scrolling for `key` (menu ...). Several keys can hold the lock at once. */
  lock: (key: string) => void;
  unlock: (key: string) => void;
  scrollTo: (target: string | number | HTMLElement, opts?: ScrollOptions) => void;
}

const ScrollContext = createContext<ScrollApi | null>(null);

/**
 * The only scroll system: Lenis drives GSAP ScrollTrigger through the GSAP ticker. Lenis is off
 * with prefers-reduced-motion (native scroll; ScrollTrigger still works).
 */
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const locksRef = useRef(new Set<string>());
  const reducedRef = useRef(reduced);

  const api = useMemo<ScrollApi>(() => {
    const apply = () => {
      const locked = locksRef.current.size > 0;
      document.documentElement.classList.toggle("is-scroll-locked", locked);
      if (locked) lenisRef.current?.stop();
      else lenisRef.current?.start();
    };
    return {
      lock: (key) => {
        locksRef.current.add(key);
        apply();
      },
      unlock: (key) => {
        locksRef.current.delete(key);
        apply();
      },
      scrollTo: (target, { offset = 0, immediate = false } = {}) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset, immediate, force: true, duration: 1.4 });
          return;
        }
        const top =
          typeof target === "number"
            ? target
            : (typeof target === "string" ? document.querySelector<HTMLElement>(target) : target)?.getBoundingClientRect().top;
        if (top === undefined) return;
        const y = typeof target === "number" ? top : top + window.scrollY;
        window.scrollTo({ top: y + offset, behavior: immediate || reducedRef.current ? "auto" : "smooth" });
      },
    };
  }, []);

  useEffect(() => {
    reducedRef.current = reduced;
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    if (locksRef.current.size > 0) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // Fonts and images change layout height: re-measure ScrollTriggers once they settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  // New route: start at the top (or at the hash), then re-measure. The first load is left to the
  // browser so reloads keep their restored scroll position.
  const lastPath = useRef(pathname);
  useEffect(() => {
    let hash = "";
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      hash = window.location.hash;
      try {
        api.scrollTo(hash || 0, { immediate: true });
      } catch {
        api.scrollTo(0, { immediate: true });
      }
    }
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      // The refresh adds the pinned Atlas spacer and moves later sections, so land on the hash again.
      if (hash) {
        try {
          api.scrollTo(hash, { immediate: true });
        } catch {
          // Invalid hash: keep the first jump.
        }
      }
    }, 100);
    return () => window.clearTimeout(id);
  }, [pathname, api]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useScroll(): ScrollApi {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used inside <ScrollProvider>");
  return ctx;
}
