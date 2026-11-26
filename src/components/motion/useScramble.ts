"use client";

import { useCallback, useEffect, useRef } from "react";
import { scrambleTo } from "@/lib/scramble";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/** Returns `run(el, text)`: scramble-decodes `text` into `el` (plain swap with reduced motion). */
export function useScramble() {
  const reduced = useReducedMotion();
  const cancelRef = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelRef.current?.(), []);
  return useCallback(
    (el: HTMLElement | null, text: string) => {
      cancelRef.current?.();
      cancelRef.current = null;
      if (!el) return;
      if (reduced) el.textContent = text;
      else cancelRef.current = scrambleTo(el, text);
    },
    [reduced],
  );
}
