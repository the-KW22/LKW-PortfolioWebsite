"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ScrollTrigger } from "@/lib/gsap";
import { useFinePointer, useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { useScroll } from "@/components/motion/ScrollProvider";
import type { Project } from "@/content/types";
import { AtlasBoard } from "./AtlasBoard";
import { AtlasList } from "./AtlasList";

const noopSubscribe = () => () => {};

function Heading({ count, srOnly = false }: { count: number; srOnly?: boolean }) {
  if (srOnly) {
    return (
      <h2 id="projects-title" className="sr-only">
        Personal projects
      </h2>
    );
  }
  return (
    <>
      <p className="mono-label text-mute">03 — {count} builds</p>
      <h2
        id="projects-title"
        className="mt-4 font-display text-[clamp(52px,9vw,150px)] leading-[0.85] font-black tracking-display"
      >
        Personal
        <br />
        <em className="font-serif font-normal italic text-violet tracking-[-0.02em]">projects</em>
      </h2>
    </>
  );
}

const FOCUSABLE = 'a[href]:not([tabindex="-1"]),button:not([disabled])';

/** Full-screen map for phones and tablets: Close button + Esc, focus trapped, scroll locked. */
function Fullscreen({ projects, reduced, onClose }: { projects: Project[]; reduced: boolean; onClose: () => void }) {
  const { lock, unlock } = useScroll();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    lock("atlas");
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-atlas-close]")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const els = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest("[aria-hidden=true]"));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock("atlas");
    };
  }, [lock, unlock]);

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Project atlas, full screen" className="fixed inset-0 z-80 bg-bg">
      <AtlasBoard projects={projects} mode="fullscreen" reduced={reduced} onClose={onClose} />
    </div>,
    document.body,
  );
}

/**
 * 03 Personal projects. Picks between three presentations (spec section 4):
 * - pinned atlas: desktop with a mouse, motion allowed. 280vh section, sticky stage, scroll-scrubbed intro.
 * - list: small screens, touch, reduced motion, no JS. Plain links. Phones also get "Explore the map".
 * - static board: reduced motion users who switch to the atlas view (no intro, tilt or inertia).
 * The server renders the list, so it is also what crawlers and no-JS visitors get.
 */
export function Atlas({ projects }: { projects: Project[] }) {
  const wide = useMediaQuery("(min-width: 768px)");
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [userView, setUserView] = useState<"list" | "board" | null>(null);
  const [explore, setExplore] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const exploreBtnRef = useRef<HTMLButtonElement>(null);

  // Board and pointer drag only where a mouse is the main input; elsewhere the page must always scroll.
  const canInline = wide && fine;
  const view = !canInline ? "list" : (userView ?? (reduced ? "list" : "board"));
  const pinned = view === "board" && !reduced;

  // The section changes height with the view: re-measure every ScrollTrigger after it settles.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => window.clearTimeout(id);
  }, [view, pinned]);

  const closeExplore = () => {
    setExplore(false);
    exploreBtnRef.current?.focus({ preventScroll: true });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-title"
      className={pinned ? "relative h-[280vh]" : "relative"}
    >
      {view === "board" && pinned && (
        <div className="sticky top-0 h-svh overflow-clip">
          <Heading count={projects.length} srOnly />
          <AtlasBoard
            key="pinned"
            projects={projects}
            mode="pinned"
            sectionRef={sectionRef}
            reduced={reduced}
            onShowList={() => setUserView("list")}
          />
        </div>
      )}

      {view === "board" && !pinned && (
        <div className="py-[10vh]">
          <div className="px-[5vw]">
            <Heading count={projects.length} />
          </div>
          <div className="mt-8 h-[88svh] overflow-clip border-y border-line">
            <AtlasBoard
              key="inline"
              projects={projects}
              mode="inline"
              reduced={reduced}
              onShowList={() => setUserView("list")}
            />
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="px-[5vw] py-[14vh]">
          <Heading count={projects.length} />
          {mounted && (
            <div className="mt-8 flex flex-wrap gap-3">
              {canInline ? (
                <button type="button" className="atlas-pill" onClick={() => setUserView("board")}>
                  Atlas view
                </button>
              ) : (
                <button ref={exploreBtnRef} type="button" className="atlas-pill is-primary" onClick={() => setExplore(true)}>
                  Explore the map
                </button>
              )}
            </div>
          )}
          <AtlasList projects={projects} />
        </div>
      )}

      {explore && !canInline && <Fullscreen projects={projects} reduced={reduced} onClose={closeExplore} />}
    </section>
  );
}
