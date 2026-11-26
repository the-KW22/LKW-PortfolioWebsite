"use client";

import { useCallback } from "react";

// Hook for later phases to drive the custom cursor from code (the atlas, the X-ray lens).
// Markup alternative: data-cursor="label" data-cursor-label="DRAG" | data-cursor="lens" | data-cursor="hidden".
// An override set here wins over whatever data attribute is under the pointer.

export type CursorVariant = "default" | "hover" | "label" | "lens" | "hidden";
export interface CursorState {
  variant: CursorVariant;
  label?: string;
}

let override: CursorState | null = null;
const listeners = new Set<() => void>();

export function setCursorOverride(state: CursorState | null) {
  override = state;
  listeners.forEach((l) => l());
}
export function getCursorOverride() {
  return override;
}
export function subscribeCursorOverride(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** `set({ variant: "label", label: "DRAG" })`, `set({ variant: "lens" })`, `set(null)` to release. */
export function useCursor() {
  const set = useCallback((state: CursorState | null) => setCursorOverride(state), []);
  return { set };
}
