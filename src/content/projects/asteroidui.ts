import type { Project } from "../types";

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
};
