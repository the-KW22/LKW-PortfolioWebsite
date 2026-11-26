"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Full-height message page (404, error, resume fallback). The heading takes focus on mount so
 * keyboard and screen-reader users land on the message instead of the top of the page.
 * No animation here: it must work when everything else is broken.
 */
export function StatusPage({
  label,
  title,
  accent,
  children,
  actions,
}: {
  label: string;
  title: string;
  accent: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    h1.current?.focus({ preventScroll: true });
  }, []);
  return (
    <section className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
      <p className="mono-label mb-6 text-lime">{label}</p>
      <h1
        ref={h1}
        tabIndex={-1}
        className="font-display text-[clamp(48px,9vw,150px)] leading-[0.9] font-black tracking-display outline-none"
      >
        {title} <em className="font-serif font-normal text-violet">{accent}</em>
      </h1>
      <div className="mt-6 max-w-md text-mute">{children}</div>
      <div className="mono-label mt-10 flex flex-wrap gap-x-6 gap-y-3">{actions}</div>
    </section>
  );
}

export const statusLink = "text-ink underline underline-offset-4 hover:text-violet";
