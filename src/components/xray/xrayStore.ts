"use client";

import { useSyncExternalStore } from "react";

// Page-wide X-ray state: true = the bones layer is open over every X-ray-capable screenshot
// (circle wipe on a mouse device, draggable lens on touch). One flag, shared by the top-bar
// toggle, the X key and every XrayFrame.

let on = false;
const listeners = new Set<() => void>();

export function setXrayOn(next: boolean) {
  if (on === next) return;
  on = next;
  listeners.forEach((l) => l());
}
export const getXrayOn = () => on;

export function useXrayOn(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => on,
    () => false,
  );
}
