import type { Project } from "../types";
import { coreex } from "./coreex";
import { asteroidui } from "./asteroidui";
import { moonwave } from "./moonwave";
import { brickly } from "./brickly";
import { petcare } from "./petcare";
import { isTodo } from "./media";

/** All projects in display order. Add a project by adding a file and listing it here. */
export const projects: Project[] = [coreex, asteroidui, moonwave, brickly, petcare].sort(
  (a, b) => a.order - b.order,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The project after `slug`, wrapping around to the first. */
export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

const categoryLabel: Record<Project["category"], string> = {
  "full-stack": "full-stack project",
  "component-library": "component library",
  "web-design": "web design project",
};

/** Meta description: the summary once the owner has written it, otherwise a factual fallback. */
export function projectDescription(p: Project): string {
  if (!isTodo(p.summary)) return p.summary;
  return `${p.name}: ${p.tagline.toLowerCase()}. A ${categoryLabel[p.category]} by Leow Kai Wen.`;
}

/** Ruler entries for a case-study page (design spec 3.2). Ids match the `id`s in /projects/[slug]. */
export function caseSectionsFor(p: Project): { id: string; num: string; label: string }[] {
  const ids: [string, string][] = [["overview", "Overview"]];
  if (p.stats?.length) ids.push(["stats", "Numbers"]);
  ids.push(["story", "Story"]);
  if (p.caseStudy.gallery.length) ids.push(["gallery", "Screens"]);
  if (p.caseStudy.diagram) ids.push(["architecture", "Build"]);
  ids.push(["next", "Next"]);
  return ids.map(([id, label], i) => ({ id, label, num: String(i + 1).padStart(2, "0") }));
}
