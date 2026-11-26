"use client";

import { useEffect } from "react";
import { useShell } from "@/components/shell/ShellProvider";

/** True when keystrokes belong to a text field (review decision 7). */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

/**
 * True while a modal dialog is open anywhere (the full-screen Atlas, for example). The closed menu
 * stays in the DOM as an inert, hidden dialog, so inert or hidden dialogs do not count.
 */
export function isDialogOpen(): boolean {
  return Array.from(document.querySelectorAll<HTMLElement>('dialog[open],[role="dialog"][aria-modal="true"]')).some(
    (d) => !d.closest("[inert]") && d.style.visibility !== "hidden" && !d.hidden,
  );
}

/**
 * Scoped single-key shortcut (for example "x" for X-ray). Review decision 7: it is ignored when
 * focus is in an input, textarea, select or contenteditable, when focus is inside a dialog or any
 * dialog is open, when the menu is open, when any modifier key is held, and on key repeat.
 */
export function useShortcut(key: string, handler: (e: KeyboardEvent) => void, enabled = true) {
  const { menuOpen } = useShell();
  useEffect(() => {
    if (!enabled || menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.repeat) return;
      if (e.key.toLowerCase() !== key.toLowerCase() || isTypingTarget(e.target)) return;
      if (isDialogOpen()) return; // focus in a dialog implies one is open
      handler(e);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [key, handler, enabled, menuOpen]);
}
