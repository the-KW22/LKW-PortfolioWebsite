"use client";

// Whether a kinetic warp is hiding the page. Title reveals that should land as the overlay fades
// (the case-study hero) use `whenWarpRevealed`. It is idle unless a warp is running.

let busy = false;
const listeners = new Set<() => void>();

export function setWarpBusy(next: boolean) {
  if (busy === next) return;
  busy = next;
  if (!busy) listeners.forEach((l) => l());
}

export const isWarpBusy = () => busy;

/** Runs `cb` once no warp is covering the page (immediately if none is). Returns an unsubscribe. */
export function whenWarpRevealed(cb: () => void): () => void {
  if (!busy) {
    cb();
    return () => {};
  }
  const l = () => {
    listeners.delete(l);
    cb();
  };
  listeners.add(l);
  return () => listeners.delete(l);
}
