import { projects } from "@/content/projects";
import { Atlas } from "@/components/atlas/Atlas";

/**
 * 03 Personal projects (Atlas). Keeps the section id from src/content/sections.ts. The server
 * renders the plain list (no-JS view, crawlers); the client upgrades it to the draggable board.
 */
export function Projects() {
  return <Atlas projects={projects} />;
}
