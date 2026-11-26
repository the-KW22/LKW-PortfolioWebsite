import type { XrayLayer, XrayNote } from "../types";

// X-ray "bones" layers (design spec 5.3, review decision 5). Deep for CoreEx and AsteroidUI, simple
// for PetCare, none for Moonwave and Brickly.
//
// EVERY note here is DRAFT: written by the agent from the project repos, waiting for the owner's
// approval. Sources are named in the trailing comments. A note that starts with `TODO(owner)` is a
// fact that could not be verified from the repo. Do not add numbers, endpoints or component names
// that are not in the repo.
//
// TODO(owner): all box and note POSITIONS are estimates. The owner has not supplied screenshots yet
// (the plates are placeholders for CoreEx and AsteroidUI), so re-align them to the real screens.

const n = (kind: XrayNote["kind"], x: number, y: number, text: string): XrayNote => ({
  kind,
  x,
  y,
  text,
  draft: true,
});

// ---------------------------------------------------------------- CoreEx
// Sources: CoreEx README, docs/adr/0001-0013, frontend/app/(app) file names.

export const coreexHeroXray: XrayLayer = {
  title: "Main screen",
  boxes: [
    { label: "CommandPalette", x: 30, y: 4, w: 40, h: 9 },
    { label: "Items page", x: 22, y: 20, w: 52, h: 66 },
    { label: "ChatDock", x: 78, y: 62, w: 19, h: 28 },
  ],
  notes: [
    n("flow", 3, 20, "The frontend never touches the database: it calls only the REST API, through a client generated from the OpenAPI spec."), // README, ADR 0003
    n("security", 3, 52, "Every read and write is scoped to the signed-in User. Another User's data answers 404, not 403."), // README, ADR 0001
    n("security", 3, 78, "Tables live in a dedicated coreex schema with row level security on, so Supabase's public API cannot reach them."), // README, ADR 0005
    n("data", 31, 15, "Ctrl+K switcher: exact-word search only (the palette does not use embeddings)."), // README, ADR 0008
  ],
};

export const coreexEditorXray: XrayLayer = {
  title: "Notes editor",
  boxes: [
    { label: "NoteEditor", x: 20, y: 8, w: 58, h: 84 },
    { label: "Save status", x: 62, y: 2, w: 36, h: 6 },
  ],
  notes: [
    n("data", 3, 14, "A Note is stored as Markdown, so data stays portable and exportable."), // ADR 0002
    n("flow", 3, 44, "Autosave with conflict detection when the same Note changes in two places."), // README, note-editor.tsx statuses
    n("data", 3, 72, "[[Links]] survive renames and moves, and feed backlinks and the Graph view."), // README
    n("flow", 80, 30, "Embedding runs in a scheduled sweep once a Note has been unchanged for about two minutes, not on save."), // ADR 0008
  ],
};

export const coreexSearchXray: XrayLayer = {
  title: "Semantic search",
  boxes: [
    { label: "Search page", x: 18, y: 10, w: 64, h: 80 },
    { label: "CommandPalette", x: 30, y: 2, w: 40, h: 7 },
  ],
  notes: [
    n("data", 3, 16, "By words: Postgres full-text search with filters and snippets."), // README
    n("data", 3, 40, "By meaning: Notes are split into chunks of about 250 words and embedded with gte-small (384 dimensions)."), // ADR 0008
    n("security", 3, 66, "Embeddings come from a Supabase Edge Function that answers only requests carrying its own secret, and only the API calls it."), // ADR 0008
    n("flow", 80, 40, "If the embedding function is unavailable, search falls back to exact-word matches."), // ADR 0008
  ],
};

export const coreexTokensXray: XrayLayer = {
  title: "MCP access tokens",
  boxes: [
    { label: "CreateToken", x: 12, y: 12, w: 36, h: 30 },
    { label: "TokensTable", x: 12, y: 48, w: 76, h: 40 },
  ],
  notes: [
    n("security", 52, 12, "A token is shown once and stored only as a SHA-256 hash, in a table with row level security."), // ADR 0007
    n("security", 52, 30, "Tokens expire (90 days by default), can be revoked, and are limited to 60 calls a minute."), // ADR 0007
    n("flow", 3, 6, "The MCP server runs inside the Spring Boot API at /mcp and calls the same services as the REST controllers."), // ADR 0007, README
    n("security", 52, 48, "Agents can move things to the Trash and restore them, never delete for good."), // ADR 0007
    n("build", 3, 92, "TODO(owner): confirm the tool count shown in the stats row (44) against the repo before launch."), // plan, unverified
  ],
};

// ------------------------------------------------------------- AsteroidUI
// Sources: AsteroidUI README, registry.json, src/site/catalog file names.

export const asteroidHeroXray: XrayLayer = {
  title: "Component catalog",
  boxes: [
    { label: "SiteHeader", x: 0, y: 0, w: 100, h: 9 },
    { label: "ThemeSelect", x: 82, y: 1, w: 16, h: 7 },
    { label: "ComponentDirectory", x: 6, y: 20, w: 88, h: 70 },
  ],
  notes: [
    n("build", 3, 12, "Nine components have detail pages, live examples and a shadcn-compatible registry."), // README
    n("build", 3, 44, "Catalog pages live in src/site/catalog; the component source delivered through the registry lives in src/components/ui."), // README
    n("build", 3, 78, "registry.json is maintained by hand; public/registry/ is generated output."), // README
  ],
};

export const asteroidDetailXray: XrayLayer = {
  title: "Component page",
  boxes: [
    { label: "ComponentDetail", x: 6, y: 10, w: 88, h: 82 },
    { label: "CodeBlock", x: 10, y: 60, w: 52, h: 28 },
    { label: "AgentCopyMenu", x: 66, y: 12, w: 26, h: 8 },
  ],
  notes: [
    n("build", 3, 24, "Each page has a live preview, examples, copyable usage and install instructions, and the maintained source."), // README
    n("flow", 66, 24, "AgentCopyMenu copies the page as plain text or as Markdown."), // agent-copy-menu.tsx props
    n("build", 66, 50, "TODO(owner): confirm what the contract panels (ButtonContract, ParticleContract) show before describing them."), // catalog file names only
  ],
};

export const asteroidRegistryXray: XrayLayer = {
  title: "Registry install",
  boxes: [
    { label: "CodeBlock: install command", x: 8, y: 30, w: 84, h: 14 },
    { label: "Registry items", x: 8, y: 52, w: 84, h: 38 },
  ],
  notes: [
    n("flow", 3, 12, "Install with shadcn: npx shadcn add <origin>/registry/<name>.json."), // README
    n("build", 3, 48, "Each component is its own /registry/<name>.json item; utils and library-styles are shared dependencies."), // README, public/registry
    n("build", 3, 70, "Button, for example, depends on @base-ui/react, class-variance-authority and gsap, plus the Spinner, utils and library-styles items."), // registry.json
    n("build", 50, 92, "Verified against independent Next.js and Vite consumer apps."), // README
  ],
};

// ---------------------------------------------------------------- PetCare
// Simple version: section annotations on one hero screenshot (spec review decision 5). Boxes are
// placed on the real hero screenshot (petcare-1.webp). Sources: the screenshot, the project's stack list.

export const petcareHeroXray: XrayLayer = {
  title: "Landing page hero",
  boxes: [
    { label: "Header: Home, Services, Packages, Testimonials, Contact", x: 0, y: 0, w: 100, h: 8.5 },
    { label: "Headline and intro", x: 9.5, y: 20, w: 32, h: 60 },
    { label: "Call-to-action buttons", x: 9.5, y: 89, w: 26, h: 8 },
    { label: "Hero image with floating icon badges", x: 44, y: 23, w: 47, h: 66 },
  ],
  notes: [
    n("build", 3, 12, "A design-only project: the live page is a static build of the Figma mockup."), // petcare.ts existing DRAFT
    n("build", 3, 86, "Stack: Next.js, Tailwind CSS, shadcn/ui and Lenis (smooth scrolling)."), // petcare.ts stack
    n("build", 46, 92, "TODO(owner): which parts use shadcn/ui components, and any animation techniques worth naming."), // unverified
  ],
};
