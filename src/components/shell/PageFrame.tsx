"use client";

import { useShell } from "./ShellProvider";

/** Skip link, main landmark and footer. Inert while the menu is open so focus stays in the menu. */
export function PageFrame({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const { menuOpen } = useShell();
  return (
    <div inert={menuOpen} className="flex min-h-svh flex-col">
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      {footer}
    </div>
  );
}

export function SkipLink() {
  const { menuOpen } = useShell();
  return (
    <a
      href="#main"
      inert={menuOpen}
      className="fixed top-3 left-3 z-100 -translate-y-20 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-[#0c0e05] focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
