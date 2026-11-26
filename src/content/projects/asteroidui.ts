import type { Project } from "../types";
import { placeholderMedia } from "./media";
import { asteroidDetailXray, asteroidHeroXray, asteroidRegistryXray } from "./xray";

// Sources: AsteroidUI README, implementation plan section 4. Label as in progress.
export const asteroidui: Project = {
  slug: "asteroidui",
  order: 2,
  name: "AsteroidUI",
  category: "component-library",
  status: "in-progress",
  year: null, // TODO(owner): year
  tagline: "React component library with a shadcn-compatible registry", // DRAFT
  summary:
    // DRAFT
    "A React and TypeScript component collection with a documentation-style catalog. Nine components have detail pages, live examples and a shadcn-compatible registry, verified against independent Next.js and Vite consumer apps.",
  role: "TODO(owner): role line (same AI-agent wording as CoreEx?)",
  stack: [
    { name: "React" },
    { name: "TypeScript" },
    { name: "Next.js" },
    { name: "Vite" },
    { name: "shadcn registry" },
  ],
  links: {
    live: "https://asteroid-ui.vercel.app", // TODO(owner): confirm this is the public URL
    github: null, // TODO(owner): GitHub URL (repo is public per the plan)
  },
  stats: null, // TODO(owner): real stats (components, registry items) or keep the row hidden
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
      { id: "problem", title: "The problem", lead: "TODO(owner): why build a component library, and for whom.", paragraphs: [], draft: true },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: from the AsteroidUI README.
        lead: "A React and TypeScript component collection with a documentation-style catalog and live examples.",
        paragraphs: ["Nine components have detail pages and a shadcn-compatible registry, so they can be installed into other projects."],
        draft: true,
      },
      {
        id: "decisions",
        title: "Decisions that mattered",
        lead: "A component is only done when an independent app can install and use it.", // DRAFT
        paragraphs: [],
        draft: true,
      },
      { id: "outcome", title: "The outcome", lead: "TODO(owner): where the library stands. It is still in progress.", paragraphs: [], draft: true },
    ],
    decisions: [
      { title: "A shadcn-compatible registry", body: "Components install through the same registry format shadcn uses.", draft: true },
      { title: "Verified in independent consumers", body: "The registry is checked against separate Next.js and Vite apps, not only the docs site.", draft: true },
    ],
    diagram: {
      // DRAFT: simplified from the README. TODO(owner): confirm the flow.
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
