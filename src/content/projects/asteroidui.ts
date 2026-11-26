import type { Project } from "../types";
import { placeholderMedia } from "./media";
import { asteroidDetailXray, asteroidHeroXray, asteroidRegistryXray } from "./xray";

// Sources: AsteroidUI README, CONTEXT.md, registry.json, git history (checked 2026-11-26). Label as in progress.
export const asteroidui: Project = {
  slug: "asteroidui",
  order: 2,
  name: "AsteroidUI",
  category: "component-library",
  status: "in-progress",
  year: 2026, // DRAFT: git history runs 2026-10-13 to 2026-10-18 and the repo was last pushed 2026-10-22; owner to confirm
  tagline: "React component library with a shadcn-compatible registry", // DRAFT
  summary:
    // DRAFT
    "A React and TypeScript component collection with a documentation-style catalog. Nine components have detail pages, live examples and a shadcn-compatible registry, checked against independent Next.js and Vite consumer apps. Still in progress.",
  role: "Owned the design, architecture, review and tests while directing AI coding agents.", // DRAFT: same wording as CoreEx; owner to confirm it fits this project
  stack: [
    { name: "React" },
    { name: "TypeScript" },
    { name: "Next.js" },
    { name: "Vite" },
    { name: "shadcn registry" },
  ],
  links: {
    live: "https://asteroid-ui.vercel.app", // verified 2026-11-26: HTTP 200, and /registry/button.json serves; owner to confirm it is the intended public URL
    github: "https://github.com/the-KW22/AsteroidUI", // verified 2026-11-26: public repo, matches the README's source-repository line
  },
  stats: [
    // Verified 2026-11-26: 9 files in src/components/ui; registry.json has 11 items (9 components plus the shared utils and library-styles).
    { value: "9", label: "components" },
    { value: "11", label: "registry items, incl. 2 shared" },
  ],
  xray: "deep",
  caseStudy: {
    // TODO(owner): 3-5 screenshots (or approve capturing them from the live site).
    hero: { ...placeholderMedia("AsteroidUI catalog (screenshot coming)"), xray: asteroidHeroXray },
    // DRAFT captions
    gallery: [
      { caption: "Component catalog", media: placeholderMedia("AsteroidUI catalog page (screenshot coming)") },
      { caption: "A component page with live examples", media: { ...placeholderMedia("AsteroidUI component detail (screenshot coming)"), xray: asteroidDetailXray } },
      { caption: "Registry install", media: { ...placeholderMedia("AsteroidUI registry install (screenshot coming)"), xray: asteroidRegistryXray } },
    ],
    story: [
      {
        id: "problem",
        title: "The problem",
        // DRAFT: from CONTEXT.md and the README. The owner's own reason for building it is still needed.
        lead: "A component library that grows from small pieces into whole screens, and that other projects can install rather than copy.",
        paragraphs: [
          "The library is organised in three tiers: Particles (basic components such as a button or a text field), Asteroids (composed groups such as a card or form) and Galaxies (whole screens). The nine components built so far are Particles. Asteroids and Galaxies are planned and shown as coming soon.", // DRAFT (CONTEXT.md)
        ],
        draft: true,
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: from the AsteroidUI README.
        lead: "A React and TypeScript component collection with a documentation-style catalog and live examples.",
        paragraphs: [
          "Each of the nine components has a detail page with a live preview, examples, copyable usage and install instructions, and the maintained source.", // DRAFT (README)
          "A shadcn-compatible registry delivers each component as its own installable item, with shared styles and the third-party notices. The registry file is maintained by hand and the published files are generated from it.", // DRAFT (README, registry.json)
          "The work was directed with AI coding agents, with an AGENTS.md in the repository and a Playwright test suite for the catalog.", // DRAFT: owner to approve the AI-agent wording
        ],
        draft: true,
      },
      {
        id: "decisions",
        title: "Decisions that mattered",
        lead: "A component is only done when an independent app can install and use it.", // DRAFT
        paragraphs: [],
        draft: true,
      },
      {
        id: "outcome",
        title: "The outcome",
        // DRAFT: from the README status line. The owner's view of where it is heading is still needed.
        lead: "Still in progress: nine components are installable from a live registry, with more tiers planned.",
        paragraphs: [
          "The catalog and its registry are deployed on Vercel. Wider public distribution and a formal release remain later work, so the library is presented here as work in progress.", // DRAFT (README: "public distribution and release remain later work")
        ],
        draft: true,
      },
    ],
    decisions: [
      { title: "A shadcn-compatible registry", body: "Components install through the same registry format shadcn uses, one item per component, with shared utilities and styles as dependencies.", draft: true },
      { title: "Verified in independent consumers", body: "The registry is checked against separate Next.js and Vite apps, not only the docs site.", draft: true },
      { title: "Documentation as part of the component", body: "A component ships with its detail page, live examples, copyable usage and maintained source, and the catalog is covered by browser tests.", draft: true },
    ],
    diagram: {
      // DRAFT: simplified from the README and registry.json (checked 2026-11-26).
      description:
        "Components live in the library source, are shown in the catalog, are published through the registry, and are installed into independent Next.js and Vite apps that verify them.",
      nodes: [
        { id: "src", label: "Component source", sub: "React + TypeScript", x: 14, y: 50 },
        { id: "docs", label: "Catalog", sub: "live examples", x: 46, y: 20 },
        { id: "reg", label: "Registry", sub: "shadcn-compatible", x: 46, y: 80 },
        { id: "next", label: "Next.js app", x: 86, y: 30 },
        { id: "vite", label: "Vite app", x: 86, y: 74 },
      ],
      links: [
        { from: "src", to: "docs" },
        { from: "src", to: "reg" },
        { from: "reg", to: "next" },
        { from: "reg", to: "vite" },
      ],
    },
  },
};
