import type { Project } from "../types";
import { placeholderMedia } from "./media";

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
  caseStudy: {
    // TODO(owner): hero screenshot and 4-7 gallery screens (assets checklist section 4, CoreEx).
    hero: placeholderMedia("CoreEx main screen (screenshot coming)"),
    // DRAFT captions: this screen list is the suggestion in the assets checklist, not confirmed screens.
    gallery: [
      { caption: "Notes editor", media: placeholderMedia("CoreEx notes editor (screenshot coming)") },
      { caption: "Knowledge graph", media: placeholderMedia("CoreEx knowledge graph (screenshot coming)") },
      { caption: "Semantic search", media: placeholderMedia("CoreEx search (screenshot coming)") },
      { caption: "Chat with tools", media: placeholderMedia("CoreEx chat (screenshot coming)") },
      { caption: "MCP access tokens", media: placeholderMedia("CoreEx MCP token screen (screenshot coming)") },
    ],
    story: [
      {
        id: "problem",
        title: "The problem",
        lead: "TODO(owner): one or two sentences on why CoreEx exists and who it is for.",
        paragraphs: [],
        draft: true,
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: wording by the agent from the CoreEx README and plan section 4.
        lead: "A Spring Boot API and a Next.js frontend sit on Postgres, with pgvector for semantic search and an MCP server so AI agents can work with the same workspace.",
        paragraphs: [
          "Notes are chunked and embedded, retrieved by similarity, and used to ground Chat and an evidence-only Career AI.", // DRAFT (plan section 4, ADR 0013)
          "AI agents reach the workspace through revocable, rate-limited access tokens.", // DRAFT (README)
        ],
        draft: true,
      },
      {
        id: "decisions",
        title: "Decisions that mattered",
        // DRAFT
        lead: "Every significant choice is written down as an architecture decision record, so the reasoning outlives the code.",
        paragraphs: [],
        draft: true,
      },
      {
        id: "outcome",
        title: "The outcome",
        lead: "TODO(owner): what shipped, what you learned, what you would change.",
        paragraphs: [
          "CoreEx is live as an invite-only demo and has had 24 releases.", // DRAFT (stats unconfirmed, see above)
        ],
        draft: true,
      },
    ],
    // All DRAFT, from plan section 4 / README. Owner to confirm each claim against the repo.
    decisions: [
      { title: "Per-user data isolation in the database", body: "Postgres row-level security keeps each user's data separate.", draft: true },
      { title: "A generated API client", body: "The frontend uses a client generated from the API's OpenAPI description.", draft: true },
      { title: "Tests against a real database", body: "Backend tests run against Postgres with Testcontainers, and CI runs on every change.", draft: true },
      { title: "Agent access you can revoke", body: "The MCP server exposes 44 tools behind tokens that can be revoked and are rate limited.", draft: true },
    ],
    diagram: {
      // DRAFT: from plan section 5 / design spec 5.2.
      // TODO(owner): confirm the MCP server's place (separate service or inside the API).
      description:
        "The browser talks to the Next.js frontend, which calls the Spring Boot API, which stores data in Postgres with pgvector. AI agents use an MCP server that calls the same API. The API also calls the Claude API.",
      nodes: [
        { id: "browser", label: "Browser", x: 10, y: 27 },
        { id: "web", label: "Next.js", sub: "frontend", x: 35, y: 27 },
        { id: "api", label: "Spring Boot API", x: 62, y: 27 },
        { id: "db", label: "Postgres", sub: "+ pgvector", x: 89, y: 27 },
        { id: "agents", label: "AI agents", x: 35, y: 77, ai: true },
        { id: "mcp", label: "MCP server", sub: "44 tools", x: 62, y: 77, ai: true },
        { id: "claude", label: "Claude API", x: 89, y: 77, ai: true },
      ],
      links: [
        { from: "browser", to: "web" },
        { from: "web", to: "api" },
        { from: "api", to: "db" },
        { from: "agents", to: "mcp", ai: true },
        { from: "mcp", to: "api", ai: true },
        { from: "api", to: "claude", ai: true },
      ],
    },
  },
};
