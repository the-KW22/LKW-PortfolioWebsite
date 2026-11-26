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
  ctaSecondary: "Download CV", // DRAFT
  // Floating chips at different depths. `ai` chips are lime (spec: lime marks AI things).
  // They name tech used in the owner's own projects (see src/content/projects).
  chips: [
    { label: "Claude API", ai: true, x: 62, y: 18, z: 160 },
    { label: "Spring Boot", x: 80, y: 30, z: 90 },
    { label: "Next.js", x: 52, y: 34, z: 40 },
    { label: "MCP", ai: true, x: 72, y: 46, z: 220 },
    { label: "PostgreSQL", x: 88, y: 14, z: 60 },
    { label: "TypeScript", x: 40, y: 16, z: 120 },
    { label: "pgvector", ai: true, x: 66, y: 62, z: 70 },
  ],
};

export const aboutCopy = {
  // DRAFT: owner approves. Wording follows plan section 2 flag 4 (directed AI agents, owned the
  // architecture, review and deploy). "software engineer" vs the site headline "Full-Stack Developer |
  // AI Engineer" is the owner's call (plan section 10, decision 1).
  statement:
    "I'm a software engineer in Kuala Lumpur who builds production web and AI products end to end. I plan in phases, direct AI coding agents, and keep ownership of the architecture, the review and the deploy.",
  accent: ["production"],
  // Spec section 4 (02 About): only these four CV facts. The owner chose to show them without
  // captions beyond the short label (review decision 4); the 90% basis is stated in Experience.
  facts: [
    { value: 90, suffix: "%+", label: "Messages auto-answered by an AI reply platform I built", ai: true }, // DRAFT label
    { value: 80, suffix: "+", label: "Patients on a portal I started and built" }, // DRAFT label
    { value: 24, suffix: "", label: "Releases shipped on CoreEx, my own product" }, // DRAFT label (24: confirm against repo)
    { value: 2025, suffix: "", from: 1990, label: "Graduated in Software Engineering, TARUMT" }, // DRAFT label
  ] as { value: number; suffix: string; from?: number; label: string; ai?: boolean }[],
};

export const experienceCopy = {
  titleLines: ["Where I've", "shipped"], // DRAFT
};

export const stackCopy = {
  titleLines: ["The stack", "I build with"], // DRAFT
  hint: "Pick a tool to see where it shows up in my work.", // DRAFT
  noMatch: "On my CV; not tied to one listed project yet.", // DRAFT
};

export const servicesCopy = {
  titleLines: ["What I can", "build for you"], // DRAFT
  cards: [
    {
      title: "Web apps and SaaS",
      body: "Full products with auth, databases and dashboards. Next.js, Spring Boot, Postgres.", // DRAFT
    },
    {
      title: "AI features and automation",
      body: "LLM pipelines, retrieval over your own data and MCP servers, with server-side gates on what gets sent automatically.", // DRAFT
    },
    {
      title: "Sites with motion",
      body: "Marketing and portfolio sites with scroll animation, 3D and a lot of care.", // DRAFT
    },
    {
      title: "Custom builds",
      body: "Integrations, internal tools and the odd idea that doesn't fit a box.", // DRAFT
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
