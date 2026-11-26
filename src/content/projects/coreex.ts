import type { Project } from "../types";

// Sources: CV v5 (Projects), CoreEx README, implementation plan section 4.
// Re-check stats against the repo before launch (assets checklist section 4).
export const coreex: Project = {
  slug: "coreex",
  order: 1,
  name: "CoreEx",
  category: "full-stack",
  status: "live",
  year: null, // TODO(owner): year
  tagline: "Personal knowledge base and career workspace", // DRAFT
  summary:
    // DRAFT
    "A live knowledge base and career workspace: Markdown notes, files, backlinks, a knowledge graph and semantic search with pgvector, plus an MCP server that lets AI agents work with it through revocable, rate-limited access tokens.",
  role: "Owned product decisions, architecture, review, tests and releases while directing AI coding agents.",
  stack: [
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "Spring Boot" },
    { name: "PostgreSQL" },
    { name: "Supabase" },
    { name: "pgvector", ai: true },
    { name: "Flyway" },
    { name: "Claude API", ai: true },
    { name: "MCP", ai: true },
    { name: "Docker" },
    { name: "Render" },
  ],
  links: {
    live: "https://core-ex.vercel.app",
    liveNote: "Invite-only demo, request access", // DRAFT (plan decision 2 default)
    github: "https://github.com/the-KW22/CoreEx",
  },
  stats: [
    // TODO(owner): confirm all three against the repo before launch.
    { value: "44", label: "MCP tools" },
    { value: "24", label: "releases" },
    { value: "13", label: "ADRs" },
  ],
  xray: "deep",
};
