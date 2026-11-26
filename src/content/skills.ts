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
 * Broad skills that no project lists as a tech tag, mapped to the work that demonstrates them
 * (checked against the CoreEx and CV sources in Phase 7). Exact tech-name matches are added to these.
 * DRAFT: the owner approves each mapping. Skills not listed here and without an exact match show the "noMatch" line.
 */
const BROAD_USED_IN: Record<string, string[]> = {
  "LLM APIs": ["CoreEx", "AI Auto-Reply Platform", "Patient Portal and Clinician Admin", "Social Media Management Platform"], // Claude API in CoreEx; OpenAI and Groq in the NM Media projects (CV)
  "RAG and LLM evaluation": ["CoreEx", "AI Auto-Reply Platform"], // CoreEx: notes chunked, embedded and retrieved to ground Chat (ADR 0008, 0009, 0013). Auto-reply: replies grounded in each client's knowledge base, 90%+ measured by replaying saved real conversations (CV)
  "MCP servers": ["CoreEx"], // 49 tools in CoreEx
  "Claude Code": ["CoreEx"], // README: built with Claude Code and Codex
  Codex: ["CoreEx"], // README
  "REST APIs": ["CoreEx"], // typed REST API with generated OpenAPI client
  "Next.js API routes": [], // TODO(owner): which NM Media projects use route handlers
  Playwright: ["CoreEx", "AsteroidUI"], // README of each repo
  JUnit: ["CoreEx"],
  "GitHub Actions": ["CoreEx"], // CI workflow
  Docker: ["CoreEx"],
  Vitest: ["CoreEx"], // frontend unit and component tests
  Java: ["CoreEx"], // Spring Boot backend, Java 21
  Cursor: [], // TODO(owner): which projects, if any, were built with Cursor and AntiGravity
  AntiGravity: [],
};

/**
 * Names of the projects and work items whose stack lists this skill ("Used in: ..."), matched by exact
 * tech name, plus the explicit mappings above for broad skills.
 */
export function usedIn(skillName: string): string[] {
  const work = [
    ...projects.map((p) => ({ name: p.name, stack: p.stack })),
    ...experience.flatMap((e) => e.projects ?? []),
  ];
  const exact = work.filter((w) => w.stack.some((t) => t.name === skillName)).map((w) => w.name);
  return Array.from(new Set([...exact, ...(BROAD_USED_IN[skillName] ?? [])]));
}
