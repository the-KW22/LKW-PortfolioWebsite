"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { homeSections, type HomeSection } from "@/content/sections";
import { caseSectionsFor, getProject } from "@/content/projects";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { Magnetic } from "@/components/motion/Magnetic";
import { useScramble } from "@/components/motion/useScramble";
import { useScroll } from "@/components/motion/ScrollProvider";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useShell } from "./ShellProvider";
import { cn } from "@/lib/utils";

/* ---------- Kuala Lumpur clock (HH:MM:SS GMT+8) ---------- */

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
});

function readClock() {
  const parts = timeFmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("hour")}:${get("minute")}:${get("second")} ${get("timeZoneName")}`;
}
function subscribeClock(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}

function Clock() {
  // Server renders a placeholder so hydration never mismatches; the client takes over immediately.
  const time = useSyncExternalStore(subscribeClock, readClock, () => "--:--:--");
  const open = site.availability !== "closed";
  return (
    <div className="mono-label hidden text-right leading-normal lg:block">
      <div className="text-ink tabular-nums" aria-hidden="true">
        {time}
      </div>
      <div className="text-mute">
        <span
          aria-hidden="true"
          className={cn(
            "mr-[7px] inline-block size-[7px] rounded-full align-baseline",
            open ? "animate-pulse-dot bg-lime shadow-[0_0_10px_var(--lime)]" : "bg-mute",
          )}
        />
        KL · {site.availabilityCopy[site.availability]}
      </div>
    </div>
  );
}

/* ---------- logo ---------- */

function Logo({ inert }: { inert: boolean }) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const run = useScramble();
  return (
    <Link
      href="/"
      inert={inert}
      className="group col-start-1 flex items-center gap-3 justify-self-start rounded-xl"
      onPointerEnter={() => run(nameRef.current, site.name)}
      onPointerLeave={() => run(nameRef.current, site.brand)}
      onFocus={() => run(nameRef.current, site.name)}
      onBlur={() => run(nameRef.current, site.brand)}
    >
      {/* Placeholder tile; the final logo replaces it (assets checklist). */}
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-[10px] border border-[#2d2c3a] bg-bg/60 text-[13px] font-black tracking-[-0.03em] backdrop-blur-md">
        <span aria-hidden="true">LKW</span>
        <span aria-hidden="true" className="logo-scan" />
      </span>
      <span className="sr-only">{site.brand}, home</span>
      <span ref={nameRef} aria-hidden="true" className="hidden min-w-[130px] text-sm font-semibold sm:block">
        {site.brand}
      </span>
    </Link>
  );
}

/* ---------- section ruler ---------- */

function Ruler({ inert, sections }: { inert: boolean; sections: HomeSection[] }) {
  const rulerRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useScroll();
  const count = sections.length;
  // Index-aligned with `sections` (null when a section is missing from the page).
  const triggersRef = useRef<(ScrollTrigger | null)[]>([]);
  const gesture = useRef<{ id: number; x0: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);

  // Inverse of the marker placement: pointer x on the ruler -> a scroll position inside that section.
  const scrubTo = (clientX: number) => {
    const nav = rulerRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const f = Math.min(Math.max((clientX - rect.left - 14) / (rect.width - 28), 0), 0.9999) * count;
    const i = Math.floor(f);
    const t = triggersRef.current[i];
    if (!t) return;
    const y = t.start + (f - i) * (t.end - t.start);
    scrollTo(Math.min(Math.max(y, 0), ScrollTrigger.maxScroll(window)), { immediate: true });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    suppressClick.current = false;
    gesture.current = { id: e.pointerId, x0: e.clientX, dragging: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.dragging) {
      if (Math.abs(e.clientX - g.x0) <= 5) return; // below this it is a click, not a drag
      g.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.dragging = "";
    }
    scrubTo(e.clientX);
  };
  const onPointerEnd = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (!g.dragging) return;
    suppressClick.current = true; // the browser fires a click on release; a drag must not jump
    e.currentTarget.releasePointerCapture(e.pointerId);
    delete e.currentTarget.dataset.dragging;
  };

  useGSAP(
    () => {
      const marker = markerRef.current;
      if (!marker) return;
      const place = (i: number, p: number) => {
        marker.style.left = `calc(14px + (100% - 28px) * ${(i + p) / count})`;
      };
      const triggers = sections.map((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onUpdate: (self) => place(i, self.progress),
          onToggle: (self) => {
            if (!self.isActive) return;
            setActive(i);
            place(i, self.progress);
          },
        });
      });
      triggersRef.current = triggers;
      return () => {
        triggers.forEach((t) => t?.kill());
        triggersRef.current = [];
      };
    },
    { scope: rulerRef, dependencies: [sections] },
  );

  return (
    <nav
      ref={rulerRef}
      aria-label="Page sections"
      inert={inert}
      data-cursor="label"
      data-cursor-label="DRAG"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      // The numbers are links; a native link drag would cancel the pointer stream mid-scrub.
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
      className="relative hidden h-11 w-[min(440px,36vw)] cursor-grab touch-none items-center rounded-xl border border-[#23222e] bg-bg/60 px-3.5 backdrop-blur-md select-none data-[dragging]:cursor-grabbing md:flex"
    >
      <div aria-hidden="true" className="ruler-ticks" />
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === i ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(`#${s.id}`);
          }}
          className={cn(
            "relative flex-1 pt-[18px] text-center font-mono text-[10px] font-medium transition-colors duration-300",
            active === i ? "text-ink" : "text-mute hover:text-ink",
          )}
        >
          {s.num}
          <span className="sr-only"> {s.label}</span>
        </a>
      ))}
      <span
        ref={markerRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1.5 left-3.5 h-4 w-0.5 bg-lime shadow-[0_0_10px_var(--lime)] transition-[left] duration-150 ease-linear"
      >
        <span className="mono-label absolute top-[-1px] left-1/2 -translate-x-1/2 -translate-y-full pb-1.5 whitespace-nowrap text-lime">
          <ScrambleText text={(sections[active] ?? sections[0]).label} />
        </span>
      </span>
    </nav>
  );
}

/* ---------- header ---------- */

export function Header() {
  const pathname = usePathname();
  const { menuOpen, toggleMenu } = useShell();
  const isHome = pathname === "/";
  // Case-study pages get a ruler of their own sections (spec 3.2); other inner pages get none.
  const caseSlug = pathname.startsWith("/projects/") ? pathname.split("/")[2] : undefined;
  const caseSections = useMemo(() => {
    const project = caseSlug ? getProject(caseSlug) : undefined;
    return project ? caseSectionsFor(project) : null;
  }, [caseSlug]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-7 sm:py-5 [&>*]:pointer-events-auto">
      <Logo inert={menuOpen} />
      {isHome ? (
        <Ruler key="home" inert={menuOpen} sections={homeSections} />
      ) : caseSections ? (
        <Ruler key={caseSlug} inert={menuOpen} sections={caseSections} />
      ) : (
        <span />
      )}
      <div className="col-start-3 flex items-center gap-4 justify-self-end">
        <Clock />
        <Magnetic>
          <button
            ref={buttonRef}
            id="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={toggleMenu}
            className="flex h-11 items-center gap-2.5 rounded-xl border border-[#2d2c3a] bg-bg/60 px-[18px] text-[13px] font-semibold backdrop-blur-md"
          >
            <span aria-hidden="true" className="grid gap-1">
              <b className={cn("block h-[1.5px] w-4 bg-ink transition-transform duration-400", menuOpen && "translate-y-[2.75px] rotate-45")} />
              <b className={cn("block h-[1.5px] w-4 bg-ink transition-transform duration-400", menuOpen && "-translate-y-[2.75px] -rotate-45")} />
            </span>
            Menu
          </button>
        </Magnetic>
      </div>
    </header>
  );
}
