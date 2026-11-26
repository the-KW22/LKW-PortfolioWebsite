"use client";

import { useEffect } from "react";
import { useShell } from "@/components/shell/ShellProvider";

/** True when keystrokes belong to a text field (review decision 7). */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/**
 * Scoped single-key shortcut (for example "x" for X-ray in Phase 5). It is ignored when focus is
 * in an input, textarea, select or contenteditable, when the menu is open, and when any modifier
 * key is held.
 */
export function useShortcut(key: string, handler: (e: KeyboardEvent) => void, enabled = true) {
  const { menuOpen } = useShell();
  useEffect(() => {
    if (!enabled || menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.repeat) return;
      if (e.key.toLowerCase() !== key.toLowerCase() || isTypingTarget(e.target)) return;
      handler(e);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [key, handler, enabled, menuOpen]);
}
