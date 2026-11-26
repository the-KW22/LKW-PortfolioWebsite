import type { Project } from "../types";
import { placeholderMedia } from "./media";
import { coreexEditorXray, coreexHeroXray, coreexSearchXray, coreexTokensXray } from "./xray";

// Sources: CV v5 (Projects), CoreEx README, ADRs 0001-0014, backend source (checked 2026-11-26, repo at v0.23.1).
// Stats were re-counted from the repo in Phase 7 (see docs/v3-owner-todo.md); the CV still says 24 releases and 13 ADRs.
export const coreex: Project = {
  slug: "coreex",
  order: 1,
  name: "CoreEx",
  category: "full-stack",
  status: "live",
  year: 2026, // DRAFT: first commit and v0.1.0 are both dated 2026-10-28; owner to confirm
  tagline: "Personal knowledge base with a job-search tracker and an MCP server", // DRAFT
  summary:
    // DRAFT
    "A live knowledge base and career workspace: Markdown notes, files, backlinks, a knowledge graph and search by words and by meaning, plus an MCP server that lets AI agents work with it through revocable, rate-limited access tokens.",
  role: "Owned product decisions, architecture, review, tests and releases while directing AI coding agents (Claude Code, Codex).", // DRAFT: wording from the CV and the CoreEx README
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
    liveNote: "Invite-only demo, request access", // DRAFT (plan decision 2 default); the README asks for demo requests via the GitHub profile
    github: "https://github.com/the-KW22/CoreEx",
  },
  stats: [
    // Verified 2026-11-26 against CoreEx v0.23.1 (staging and main agree): 49 @McpTool methods in backend/src/main,
    // 30 git tags and GitHub releases (v0.1.0 to v0.23.1), 14 files in docs/adr. The CV's 24 and 13 are older figures.
    { value: "49", label: "MCP tools" },
    { value: "30", label: "tagged releases" },
    { value: "14", label: "ADRs" },
  ],
  xray: "deep",
  caseStudy: {
    // TODO(owner): hero screenshot and 4-7 gallery screens (assets checklist section 4, CoreEx).
    hero: { ...placeholderMedia("CoreEx main screen (screenshot coming)"), xray: coreexHeroXray },
    // DRAFT captions: this screen list is the suggestion in the assets checklist, not confirmed screens.
    gallery: [
      { caption: "Notes editor", media: { ...placeholderMedia("CoreEx notes editor (screenshot coming)"), xray: coreexEditorXray } },
      { caption: "Knowledge graph", media: placeholderMedia("CoreEx knowledge graph (screenshot coming)") },
      { caption: "Semantic search", media: { ...placeholderMedia("CoreEx search (screenshot coming)"), xray: coreexSearchXray } },
      { caption: "Chat with tools", media: placeholderMedia("CoreEx chat (screenshot coming)") },
      { caption: "MCP access tokens", media: { ...placeholderMedia("CoreEx MCP token screen (screenshot coming)"), xray: coreexTokensXray } },
    ],
    story: [
      {
        id: "problem",
        title: "The problem",
        // DRAFT: from the README. The owner's own account of why it exists is still needed (checklist).
        lead: "A personal knowledge base with a job-search tracker built in, and a way to learn how production software is made end to end.",
        paragraphs: [
          "Notes in Markdown, images and PDFs, folders, tags and links sit beside a Career area for applications, resumes and cover letters. AI agents can work with all of it, but only through access the owner controls.", // DRAFT (README)
          "CoreEx is built the way a small team would build it: a typed REST API, a separate frontend, per-user data isolation, migrations, CI and staged releases, running as an invite-only deployment.", // DRAFT (README)
        ],
        draft: true,
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: wording by the agent from the CoreEx README and ADRs 0003, 0007, 0008, 0009, 0013.
        lead: "A Spring Boot API and a Next.js frontend sit on Postgres, with pgvector for search by meaning and an MCP server so AI agents can work with the same workspace.",
        paragraphs: [
          "Notes are split into chunks, embedded in a Supabase Edge Function and retrieved by similarity. Search by words and by meaning sit side by side, and Chat and the Career AI draw on the same notes as their evidence.", // DRAFT (ADR 0008, 0009, 0013)
          "The MCP server runs inside the API and calls the same services as the REST controllers, so each rule is written once. AI agents reach the workspace through revocable, rate-limited access tokens, and can move things to the Trash but never delete them for good.", // DRAFT (README, ADR 0007)
          "Chat reads notes through the same tools an agent uses. When it wants to change something, it stores a proposal that only runs after the user approves it.", // DRAFT (ADR 0009, ToolCatalogue.java)
          "The work was planned in GitHub issues and built with AI coding agents under direction: the owner decided what to build, set the architecture, reviewed every change and ran the tests and releases.", // DRAFT (README, CV); owner to approve
        ],
        draft: true,
      },
      {
        id: "decisions",
        title: "Decisions that mattered",
        // DRAFT
        lead: "Every hard-to-reverse choice is written down as an architecture decision record, so the reasoning outlives the code.",
        paragraphs: [],
        draft: true,
      },
      {
        id: "outcome",
        title: "The outcome",
        // DRAFT: figures verified against the repo on 2026-11-26. The owner's "what I learned" is still needed.
        lead: "CoreEx is live as an invite-only demo and shipped 30 tagged releases in its first four weeks.",
        paragraphs: [
          "Between 28 October and 25 November 2026 the project went from v0.1.0 to v0.23.1, with 14 architecture decision records, 49 MCP tools and CI on every pull request: build, OpenAPI and client drift checks, typecheck, lint, and unit, API and end-to-end tests.", // DRAFT (git tags, docs/adr, README)
        ],
        draft: true,
      },
    ],
    // All DRAFT, from the README and ADRs; each was checked against the repo on 2026-11-26.
    decisions: [
      { title: "Every request is scoped to the signed-in user", body: "Another user's data answers 404, not 403, so nothing leaks about what exists (ADR 0001). Admins can see account facts and totals but never anyone's content (ADR 0004).", draft: true },
      { title: "Row-level security as a second lock", body: "Tables live in their own schema with row-level security on, so Supabase's public API cannot reach them even if the application layer had a bug (ADR 0005).", draft: true },
      { title: "One API, one contract", body: "The frontend calls only the REST API, through a client generated from its OpenAPI description. CI fails if the committed spec or the generated client drifts from the code (ADR 0003).", draft: true },
      { title: "Tests against a real database", body: "Backend tests run the real application against a throwaway Postgres in Docker (Testcontainers). Frontend unit tests use Vitest and end-to-end tests use Playwright.", draft: true },
      { title: "Agent access you can revoke", body: "The MCP server runs inside the API. Access tokens are stored hashed, can be revoked, expire and are rate limited, and agents can never delete anything for good (ADR 0007).", draft: true },
      { title: "AI cost and evidence are bounded", body: "Each user has a daily budget for Chat (ADR 0009), and the Career AI states only what the user's own notes and documents support (ADR 0013).", draft: true },
    ],
    diagram: {
      // DRAFT: from the CoreEx README architecture diagram and ADR 0007 (the MCP server runs inside the API).
      description:
        "The browser talks to the Next.js frontend, which calls the Spring Boot API, which stores data in Postgres with pgvector. AI agents connect to the MCP server, which runs inside the API and uses the same services. The API also calls the Claude API.",
      nodes: [
        { id: "browser", label: "Browser", x: 10, y: 27 },
        { id: "web", label: "Next.js", sub: "frontend", x: 35, y: 27 },
        { id: "api", label: "Spring Boot API", x: 62, y: 27 },
        { id: "db", label: "Postgres", sub: "+ pgvector", x: 89, y: 27 },
        { id: "agents", label: "AI agents", x: 35, y: 77, ai: true },
        { id: "mcp", label: "MCP server", sub: "49 tools, inside the API", x: 62, y: 77, ai: true },
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
