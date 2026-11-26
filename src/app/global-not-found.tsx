import type { Metadata } from "next";
import "./(site)/globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Page not found | Leow Kai Wen",
  robots: { index: false },
};

// Used for URLs that match no route at all (for example /nope). The app has two root layouts
// (the site and the archived /v2), so there is no single layout to build that 404 from. Plain
// anchors on purpose: this document has no app shell or router providers.
export default function GlobalNotFound() {
  const link = "text-ink underline underline-offset-4 hover:text-violet";
  return (
    <html lang="en" className={`h-full antialiased ${fontVariables}`}>
      <body className="min-h-full">
        <main className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
          <p className="mono-label mb-6 text-lime">Error 404</p>
          <h1 className="font-display text-[clamp(48px,9vw,150px)] leading-[0.9] font-black tracking-display">
            Page not <em className="font-serif font-normal text-violet">found</em>
          </h1>
          <p className="mt-6 max-w-md text-mute">
            This page does not exist. It may have moved, or the address may have a typo.
          </p>
          <p className="mono-label mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- document outside the app shell: a full load is intended */}
            <a href="/" className={link}>
              Go home
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- document outside the app shell: a full load is intended */}
            <a href="/projects" className={link}>
              View projects
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
