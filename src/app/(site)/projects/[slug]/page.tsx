import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, site } from "@/content/site";
import { getNextProject, getProject, projectDescription, projects, xrayLayersFor } from "@/content/projects";
import { XrayNotes } from "@/components/xray/XrayNotes";
import { CaseTopBar } from "@/components/case/CaseTopBar";
import { CaseHero } from "@/components/case/CaseHero";
import { Plate3D } from "@/components/case/Plate3D";
import { MediaView } from "@/components/case/MediaView";
import { StatRow } from "@/components/case/StatRow";
import { StorySections } from "@/components/case/StorySections";
import { PinnedGallery } from "@/components/case/PinnedGallery";
import { ArchDiagram } from "@/components/case/ArchDiagram";
import { NextProject } from "@/components/case/NextProject";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `${SITE_URL}/projects/${project.slug}`;
  const description = projectDescription(project);
  const title = `${project.name}: ${project.tagline}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${title} | Leow Kai Wen`, description },
    twitter: { card: "summary_large_image", title: `${title} | Leow Kai Wen`, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy: cs } = project;
  const next = getNextProject(project.slug);
  const xr = xrayLayersFor(project);
  const url = `${SITE_URL}/projects/${project.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline,
    description: projectDescription(project),
    url,
    author: { "@type": "Person", name: site.name, url: SITE_URL },
    keywords: project.stack.map((t) => t.name).join(", ") || undefined,
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    sameAs: [project.links.live, project.links.github].filter(Boolean),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // "<" is escaped so content can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CaseTopBar order={project.order} total={projects.length} name={project.name} hasXray={xr.any} />

      <section id="overview" data-case-section data-case-label="Overview" aria-label={`${project.name} overview`}>
        <CaseHero project={project} />
        <div className="mt-[10vh] px-[5vw]">
          <Plate3D>
            <MediaView media={cs.hero} label={project.name} priority />
          </Plate3D>
          {xr.hero ? <XrayNotes layer={xr.hero} /> : null}
        </div>
      </section>

      <StatRow stats={project.stats} />
      <StorySections story={cs.story} decisions={cs.decisions} />
      {cs.gallery.length ? <PinnedGallery screens={cs.gallery} name={project.name} /> : null}

      {/* Plain-text X-ray notes for the gallery screens. Kept out of the pinned gallery so keyboard focus never scrolls the scrubbed track. */}
      {xr.gallery.length ? (
        <section aria-labelledby="xray-notes-title" className="px-[5vw] pb-[8vh]">
          <h2 id="xray-notes-title" className="mono-label text-mute">
            Engineering notes for the screens
          </h2>
          {xr.gallery.map((layer) => (
            <XrayNotes key={layer.title} layer={layer} />
          ))}
        </section>
      ) : null}

      {cs.diagram ? (
        <section
          id="architecture"
          data-case-section
          data-case-label="Build"
          aria-labelledby="architecture-title"
          className="px-[5vw] py-[14vh]"
        >
          <h2
            id="architecture-title"
            className="font-display mb-10 text-[clamp(32px,5vw,72px)] leading-none font-black tracking-display"
          >
            How it <em className="font-serif font-normal text-violet">fits</em> together
          </h2>
          <ArchDiagram diagram={cs.diagram} name={project.name} />
        </section>
      ) : null}

      <NextProject next={next} currentName={project.name} />
    </article>
  );
}
