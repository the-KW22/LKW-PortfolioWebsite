"use client";

import { useSyncExternalStore } from "react";

// Whether the preloader has finished (or was never shown). Hero and reveal animations that should
// wait for the loader use `whenPreloaderDone` / `usePreloaderDone`.
// The inline script in the root layout sets data-preload="1" on <html> when the loader will run.

const listeners = new Set<() => void>();
let done = typeof document === "undefined" ? false : document.documentElement.dataset.preload !== "1";

export function markPreloaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined" && !done) {
  // Failsafe: never let animations wait forever if the loader fails to mount.
  window.setTimeout(markPreloaderDone, 4000);
}

/** Runs `cb` once the preloader is done (immediately if it already is). Returns an unsubscribe. */
export function whenPreloaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  const l = () => {
    if (!done) return;
    listeners.delete(l);
    cb();
  };
  listeners.add(l);
  return () => listeners.delete(l);
}

export function usePreloaderDone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => true,
  );
}
