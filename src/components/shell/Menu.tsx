"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { homeSections, menuCopy } from "@/content/sections";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useScroll } from "@/components/motion/ScrollProvider";
import { useShell } from "./ShellProvider";

const FOCUSABLE = "a[href],button:not([disabled])";

/** Full-screen menu: circle reveal from the Menu button, focus trap, Esc to close, focus returns to the button. */
export function Menu() {
  const { menuOpen, closeMenu } = useShell();
  const { lock, unlock, scrollTo } = useScroll();
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  // Section to scroll to once the menu's scroll lock is released (scrolling earlier gets cancelled by Lenis restart).
  const pendingScroll = useRef<string | null>(null);
  const isHome = pathname === "/";

  // Open / close animation.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const links = el.querySelectorAll("[data-menu-link]");
    const side = el.querySelectorAll("[data-menu-side]");
    const btn = document.getElementById("menu-button");
    const r = btn?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth - 70;
    const cy = r ? r.top + r.height / 2 : 42;
    const radius = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) + 40;
    const at = `at ${cx}px ${cy}px`;

    if (menuOpen) {
      wasOpen.current = true;
      lock("menu");
      gsap.killTweensOf([el, links, side]);
      gsap.set(el, { visibility: "visible" });
      if (reduced) {
        gsap.fromTo(el, { opacity: 0, clipPath: "none" }, { opacity: 1, duration: 0.15 });
      } else {
        gsap.fromTo(
          el,
          { clipPath: `circle(0px ${at})`, opacity: 1 },
          { clipPath: `circle(${radius}px ${at})`, duration: 0.9, ease: "power3.inOut" },
        );
        gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, delay: 0.25, ease: "expo.out" });
        gsap.fromTo(side, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, delay: 0.4, ease: "expo.out" });
      }
      // Move focus into the menu once it is open.
      const first = el.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      wasOpen.current = false;
      unlock("menu");
      if (pendingScroll.current) {
        scrollTo(`#${pendingScroll.current}`);
        pendingScroll.current = null;
      }
      gsap.killTweensOf([el, links, side]);
      const hide = () => {
        gsap.set(el, { visibility: "hidden", clearProps: "clipPath,opacity" });
        gsap.set([links, side], { clearProps: "transform,opacity" });
      };
      if (reduced) gsap.to(el, { opacity: 0, duration: 0.15, onComplete: hide });
      else gsap.to(el, { clipPath: `circle(0px ${at})`, duration: 0.7, ease: "power3.inOut", onComplete: hide });
      btn?.focus({ preventScroll: true });
    }
  }, [menuOpen, reduced, lock, unlock, scrollTo]);

  // Safety: never leave scroll locked if the menu unmounts while open.
  useEffect(() => () => unlock("menu"), [unlock]);

  // Esc closes; Tab wraps between the Menu button and the menu's own controls.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const btn = document.getElementById("menu-button");
      const inside = Array.from(overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      const order = btn ? [btn, ...inside] : inside;
      if (!order.length) return;
      const idx = order.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (idx <= 0 ? order.length - 1 : idx - 1) : idx === order.length - 1 ? 0 : idx + 1;
      e.preventDefault();
      order[next].focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  // Navigating to another route closes the menu.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      closeMenu();
    }
  }, [pathname, closeMenu]);

  const onSectionClick = (e: React.MouseEvent, id: string) => {
    if (!isHome) return; // next/link navigates to /#id
    e.preventDefault();
    pendingScroll.current = id;
    closeMenu();
  };

  const linkedin = site.links.linkedin;
  return (
    <div
      ref={overlayRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!menuOpen}
      data-lenis-prevent
      style={{ visibility: "hidden" }}
      className="menu-grid fixed inset-0 z-45 grid overflow-y-auto bg-[#0b0a12] px-[5vw] pt-28 pb-10 md:grid-cols-[1.4fr_1fr]"
    >
      <nav aria-label="Sections" className="flex flex-col justify-center">
        {homeSections.map((s) => (
          <div key={s.id} className="overflow-hidden">
            <Link
              data-menu-link
              href={`/#${s.id}`}
              onClick={(e) => onSectionClick(e, s.id)}
              className="group flex items-baseline gap-5 rounded-lg text-[clamp(36px,min(8vw,10.5svh),118px)] leading-[0.98] font-black tracking-display"
            >
              <span aria-hidden="true" className="mono-label text-mute">
                {s.num}
              </span>
              <span className="sr-only">{s.label}</span>
              <span aria-hidden="true" className="inline-flex">
                {[...s.label].map((c, k) => (
                  <span
                    key={k}
                    className="inline-block transition-[transform,color] duration-500 ease-out group-hover:-translate-y-[8%] group-hover:-skew-x-8 group-hover:text-violet group-focus-visible:-translate-y-[8%] group-focus-visible:-skew-x-8 group-focus-visible:text-violet"
                    style={{ transitionDelay: `${k * 18}ms` }}
                  >
                    {c}
                  </span>
                ))}
              </span>
            </Link>
          </div>
        ))}
      </nav>

      <aside className="flex flex-col justify-end gap-6 pt-10 pb-5">
        <p data-menu-side className="mono-label text-mute">
          Say hi
        </p>
        <p data-menu-side className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.1]">
          {menuCopy.sayHi}
        </p>
        <p data-menu-side className="mono-label text-mute">
          <span
            aria-hidden="true"
            className={
              site.availability === "closed"
                ? "mr-[7px] inline-block size-[7px] rounded-full bg-mute"
                : "animate-pulse-dot mr-[7px] inline-block size-[7px] rounded-full bg-lime shadow-[0_0_10px_var(--lime)]"
            }
          />
          {site.availabilityCopy[site.availability]}
        </p>
        <p data-menu-side className="mono-label flex flex-wrap gap-x-4 gap-y-2">
          <a href={`mailto:${site.email}`} className="hover:text-violet">
            Email ↗
          </a>
          <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
            GitHub ↗
          </a>
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-violet">
              LinkedIn ↗
            </a>
          ) : null}
        </p>
        {/* Plain <a>: /v1 and /v2 are separate documents, not routes of this app. */}
        <p data-menu-side className="mono-label text-mute">
          Past versions:{" "}
          {site.pastVersions.map((v, i) => (
            <span key={v.href}>
              {i > 0 ? " · " : null}
              <a href={v.href} className="text-ink underline underline-offset-4 hover:text-violet">
                {v.label}
              </a>
            </span>
          ))}
        </p>
      </aside>
    </div>
  );
}
