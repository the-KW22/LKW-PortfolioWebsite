"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * useGSAP wrapper for animations that must not run with prefers-reduced-motion. Everything created
 * inside `setup` is reverted on unmount or when `deps` change (safe under React strict mode), and
 * is never created at all when the user asked for reduced motion, so content stays in its plain,
 * visible state.
 */
export function useMotion(
  scope: RefObject<Element | null>,
  setup: (ctx: gsap.Context) => void | (() => void),
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        (ctx) => setup(ctx as unknown as gsap.Context),
        scope.current ?? undefined,
      );
      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
