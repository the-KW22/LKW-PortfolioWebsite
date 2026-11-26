import type { Project } from "../types";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data.
// TODO(owner): confirm the stack (these are the v2 tags; the CV lists GSAP, Framer Motion and Lenis for these sites).
export const moonwave: Project = {
  slug: "moonwave",
  order: 3,
  name: "Moonwave",
  category: "web-design",
  status: "live",
  year: null, // TODO(owner): year
  tagline: "Creative studio marketing site with scroll-driven animation", // DRAFT
  summary: "TODO(owner): short description (assets checklist section 4)",
  role: "TODO(owner): role",
  stack: [
    { name: "Vite" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" },
    { name: "Nano Banana", ai: true },
    { name: "Kling", ai: true },
  ],
  links: {
    live: "https://music-studio-web-design.vercel.app",
    github: null, // TODO(owner): public repo or none
  },
  stats: null,
  xray: "simple",
};
