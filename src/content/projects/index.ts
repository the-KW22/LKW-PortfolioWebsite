import type { Project } from "../types";
import { coreex } from "./coreex";
import { asteroidui } from "./asteroidui";
import { moonwave } from "./moonwave";
import { brickly } from "./brickly";
import { petcare } from "./petcare";

/** All projects in display order. Add a project by adding a file and listing it here. */
export const projects: Project[] = [coreex, asteroidui, moonwave, brickly, petcare].sort(
  (a, b) => a.order - b.order,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
