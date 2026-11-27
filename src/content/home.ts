import type { Availability } from "./types";

// Home page copy (Phase 2). Every string marked DRAFT was written by the agent from CV v5 and the
// approved mockup, and waits for the owner's approval (Phase 7 pass). Facts come from CV v5 only.

export const heroCopy = {
  // DRAFT: from the approved mockup and spec section 4 (01 Hero).
  headline: ["I design", "and build", "whole products."],
  accent: "build",
  // DRAFT: from assets checklist section 2 (hero intro draft).
  intro:
    "I take products from idea to production: interfaces, APIs, databases and the AI that ties them together.",
  ctaPrimary: "See projects", // DRAFT
  // Tech chip row under the intro. `ai` chips are lime (spec: lime marks AI things).
  // They name tech used in the owner's own projects (see src/content/projects).
  chips: [
    { label: "Claude API", ai: true },
    { label: "Spring Boot" },
    { label: "Next.js" },
    { label: "MCP", ai: true },
    { label: "PostgreSQL" },
    { label: "TypeScript" },
    { label: "pgvector", ai: true },
  ] as { label: string; ai?: boolean }[],
};

export const aboutCopy = {
  // DRAFT: owner approves. Wording follows plan section 2 flag 4 and the CV summary (directed AI agents,
  // owned the architecture, review, tests and deployment), and matches the site headline.
  statement:
    "I'm a Full-Stack Developer and AI Engineer in Kuala Lumpur who builds production web and AI products end to end. I plan in phases, direct AI coding agents, and keep ownership of the architecture, the review, the tests and the deploy.",
  // SplitText matches accent per space-separated word, so each word of the two titles is listed.
  accent: ["production", "Full-Stack", "Developer", "AI", "Engineer"],
  // Spec section 4 (02 About): only these four CV facts. The owner chose to show them without
  // captions beyond the short label (review decision 4); the 90% basis is stated in Experience.
  facts: [
    { value: 90, suffix: "%+", label: "Messages auto-answered by an AI reply platform I built", ai: true }, // DRAFT label
    { value: 80, suffix: "+", label: "Patients on a portal I started and built" }, // DRAFT label
    { value: 30, suffix: "", label: "Tagged releases of CoreEx (Nov 2026), my own product" }, // 30 = git tags v0.1.0 to v0.23.1, counted 2026-11-26; owner wants it dated
    { value: 2025, suffix: "", from: 1990, label: "Graduated in Software Engineering, TARUMT" }, // DRAFT label
  ] as { value: number; suffix: string; from?: number; label: string; ai?: boolean }[],
};

export const experienceCopy = {
  titleLines: ["Where I've", "shipped"], // DRAFT
};

export const stackCopy = {
  titleLines: ["The stack", "I build with"], // DRAFT
};

export const servicesCopy = {
  titleLines: ["What I can", "build for you"], // DRAFT
  cards: [
    {
      id: "web",
      title: "Web apps and SaaS",
      body: "Full products with auth, databases and dashboards. Next.js, Spring Boot, Postgres.", // DRAFT
      tags: ["Next.js", "Spring Boot", "PostgreSQL", "Supabase"], // DRAFT, all from the CV
    },
    {
      id: "ai",
      title: "AI features and automation",
      body: "LLM pipelines, retrieval over your own data and MCP servers, with server-side gates on what gets sent automatically.", // DRAFT
      tags: ["LLM APIs", "RAG and LLM evaluation", "MCP servers"], // DRAFT, all from the CV
    },
    {
      id: "motion",
      title: "Sites with motion",
      body: "Marketing and portfolio sites with scroll animation, 3D and a lot of care.", // DRAFT
      tags: ["React", "Astro", "Tailwind CSS"], // DRAFT, all from the CV
    },
    {
      id: "build",
      title: "Custom builds",
      body: "Integrations, internal tools and the odd idea that doesn't fit a box.", // DRAFT
      tags: ["REST APIs", "Fastify", "Docker"], // DRAFT, all from the CV
    },
  ],
};

export const contactCopy = {
  headline: ["Let's build", "something great."], // DRAFT
  accent: ["great."],
  emailLabel: "Email me directly", // DRAFT
  // Line under the links. One line per availability value; the owner flips the flag in site.ts.
  availabilityLine: {
    open: "Open to full-time roles, freelance work and custom builds.", // DRAFT
    "freelance-only": "Open to freelance work and custom builds.", // DRAFT
    closed: "Not taking new work right now, but I'm happy to hear from you.", // DRAFT
  } satisfies Record<Availability, string>,
};

export interface ContactReason {
  id: string;
  label: string;
  /** Hidden when the availability flag is in one of these states. */
  hiddenWhen?: Availability[];
}

export const contactReasons: ContactReason[] = [
  { id: "role", label: "A full-time role", hiddenWhen: ["freelance-only", "closed"] }, // DRAFT
  { id: "freelance", label: "Freelance", hiddenWhen: ["closed"] }, // DRAFT
  { id: "custom", label: "A custom build", hiddenWhen: ["closed"] }, // DRAFT
  { id: "hi", label: "Just saying hi" }, // DRAFT
];

export function reasonsFor(a: Availability): ContactReason[] {
  return contactReasons.filter((r) => !r.hiddenWhen?.includes(a));
}
