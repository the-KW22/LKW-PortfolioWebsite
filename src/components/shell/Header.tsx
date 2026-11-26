"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
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
      aria-label={`${site.brand}, home`}
      className="group col-start-1 flex items-center gap-3 justify-self-start rounded-xl"
      onPointerEnter={() => run(nameRef.current, site.name)}
      onPointerLeave={() => run(nameRef.current, site.brand)}
      onFocus={() => run(nameRef.current, site.name)}
      onBlur={() => run(nameRef.current, site.brand)}
    >
      {/* Placeholder tile; the final logo replaces it (assets checklist). */}
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-[10px] border border-[#2d2c3a] bg-bg/60 text-[13px] font-black tracking-[-0.03em] backdrop-blur-md">
        LKW
        <span aria-hidden="true" className="logo-scan" />
      </span>
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

  useGSAP(
    () => {
      const marker = markerRef.current;
      if (!marker) return;
      const place = (i: number, p: number) => {
        marker.style.left = `calc(14px + (100% - 28px) * ${(i + p) / count})`;
      };
      const triggers = sections.flatMap((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return [];
        return [
          ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            onUpdate: (self) => place(i, self.progress),
            onToggle: (self) => {
              if (!self.isActive) return;
              setActive(i);
              place(i, self.progress);
            },
          }),
        ];
      });
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: rulerRef, dependencies: [sections] },
  );

  return (
    <nav
      ref={rulerRef}
      aria-label="Page sections"
      inert={inert}
      className="relative hidden h-11 w-[min(440px,36vw)] items-center rounded-xl border border-[#23222e] bg-bg/60 px-3.5 backdrop-blur-md md:flex"
    >
      <div aria-hidden="true" className="ruler-ticks" />
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={`Go to ${s.label}`}
          aria-current={active === i ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(`#${s.id}`);
          }}
          className={cn(
            "relative flex-1 pt-[18px] text-center font-mono text-[10px] font-medium transition-colors duration-300",
            active === i ? "text-ink" : "text-[#5e5d6e] hover:text-ink",
          )}
        >
          {s.num}
        </a>
      ))}
      <span
        ref={markerRef}
        aria-hidden="true"
        className="absolute top-1.5 left-3.5 h-4 w-0.5 bg-lime shadow-[0_0_10px_var(--lime)] transition-[left] duration-150 ease-linear"
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
