"use client";

import { useCallback, useEffect } from "react";
import { useShortcut, isDialogOpen } from "@/hooks/useShortcut";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { useShell } from "@/components/shell/ShellProvider";
import { getXrayOn, setXrayOn, useXrayOn } from "./xrayStore";

/**
 * Top-bar "X-ray [X]" toggle. Only rendered for projects that have a bones layer, so the button is
 * hidden and the X key does nothing elsewhere (review decision 5). The X key follows the scoped
 * shortcut rules in useShortcut (not while typing, not with modifiers, not in a dialog or the
 * menu). Esc closes the view. On touch devices the same button turns the draggable lens on and off.
 */
export function XrayToggle() {
  const on = useXrayOn();
  const fine = useFinePointer();
  const { menuOpen } = useShell();

  const toggle = useCallback(() => setXrayOn(!getXrayOn()), []);
  useShortcut("x", toggle);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || menuOpen || isDialogOpen()) return;
      setXrayOn(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [on, menuOpen]);

  // Leaving the page always closes the view.
  useEffect(() => () => setXrayOn(false), []);

  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-pressed={on}
        aria-keyshortcuts="X"
        aria-label="X-ray view: show the engineering layer under the screenshots"
        onClick={toggle}
        data-cursor="hover"
        className="mono-label flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-4 py-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white aria-pressed:bg-white aria-pressed:text-black"
      >
        X-ray
        <kbd aria-hidden="true" className="hidden font-mono sm:inline">
          [X]
        </kbd>
      </button>
      <span role="status" className="sr-only">
        {on
          ? fine
            ? "X-ray view on. The engineering layer is shown over each screenshot. Press Escape or X to close. The same notes are available as text under each image."
            : "X-ray lens on. Drag the lens over a screenshot. The same notes are available as text under each image."
          : ""}
      </span>
    </div>
  );
}
