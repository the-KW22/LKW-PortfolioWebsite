import type { SkillGroup } from "./types";
import { projects } from "./projects";
import { experience } from "./experience";

// Source: CV v5 "Technical Skills". Grouping follows spec section 4 (05 Tech stack); DRAFT grouping.
// No skill levels or percentages (spec).
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Java" },
      { name: "Python" },
      { name: "SQL" },
      { name: "HTML" },
      { name: "CSS" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Astro" },
      { name: "Vite" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js" },
      { name: "Next.js API routes" },
      { name: "Fastify" },
      { name: "Spring Boot" },
      { name: "REST APIs" },
    ],
  },
  {
    id: "data",
    label: "Data",
    skills: [
      { name: "PostgreSQL" },
      { name: "Supabase" },
      { name: "Flyway" },
      { name: "MongoDB" },
      { name: "MySQL" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    skills: [
      { name: "LLM APIs", ai: true },
      { name: "RAG and LLM evaluation", ai: true },
      { name: "MCP servers", ai: true },
      { name: "Claude Code", ai: true },
      { name: "Cursor", ai: true },
      { name: "Codex", ai: true },
      { name: "AntiGravity", ai: true },
    ],
  },
  {
    id: "devops-tools",
    label: "DevOps and tools",
    skills: [
      { name: "Git" },
      { name: "GitHub Actions" },
      { name: "Vercel" },
      { name: "Render" },
      { name: "Docker" },
      { name: "Vitest" },
      { name: "Playwright" },
      { name: "JUnit" },
      { name: "Postman" },
    ],
  },
];

/**
 * Names of the projects and work items whose stack lists this skill ("Used in: ..."),
 * matched by exact tech name. Broad skills such as "LLM APIs" have no exact match and return [];
 * TODO(owner) at Phase 2: decide which projects these broad skills should point to.
 */
export function usedIn(skillName: string): string[] {
  const work = [
    ...projects.map((p) => ({ name: p.name, stack: p.stack })),
    ...experience.flatMap((e) => e.projects ?? []),
  ];
  return work.filter((w) => w.stack.some((t) => t.name === skillName)).map((w) => w.name);
}
