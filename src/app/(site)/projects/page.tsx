import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL as siteUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Leow Kai Wen: full-stack and AI applications, a component library and web design work.",
  alternates: { canonical: `${siteUrl}/projects` },
};

// PLACEHOLDER (Phase 1). Phase 4 builds the plain project list here.
export default function ProjectsPage() {
  return (
    <section className="flex min-h-svh flex-col justify-center px-[5vw] py-32">
      <p className="mono-label mb-6 text-mute">Projects</p>
      <h1 className="font-display text-[clamp(40px,7vw,110px)] leading-[0.95] font-black tracking-display">
        Projects
      </h1>
      <p className="mt-6 max-w-md text-mute">Placeholder. The project list is built in Phase 4.</p>
      <Link href="/" className="mono-label mt-8 text-violet underline-offset-4 hover:underline">
        ← Back home
      </Link>
    </section>
  );
}
