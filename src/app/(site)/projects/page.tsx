import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/content/site";
import { projects } from "@/content/projects";
import { AtlasList } from "@/components/atlas/AtlasList";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Leow Kai Wen: full-stack and AI applications, a component library and web design work.",
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: { url: `${SITE_URL}/projects`, title: "Projects | Leow Kai Wen" },
};

/** Plain, fast, server-rendered list of every project: the no-JS and crawler view, and the "Back to projects" target. */
export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/projects/${p.slug}`,
    })),
  };
  return (
    <section className="px-[5vw] pt-36 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mono-label mb-6 text-mute">Personal projects</p>
      <h1 className="font-display text-[clamp(44px,8vw,120px)] leading-[0.95] font-black tracking-display">
        Selected <em className="font-serif font-normal text-violet">work</em>
      </h1>
      <p className="mt-6 max-w-xl text-mute">
        Five projects: a full-stack AI workspace, a component library and three web designs. Open one for the case study.
      </p>
      <AtlasList projects={projects} />
      <p className="mono-label mt-10 flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/#projects" className="text-ink underline-offset-4 hover:text-violet hover:underline">
          Explore the map ↗
        </Link>
        <Link href="/" className="text-mute underline-offset-4 hover:text-violet hover:underline">
          ← Back home
        </Link>
      </p>
    </section>
  );
}
