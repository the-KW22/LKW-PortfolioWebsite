import type { Project } from "../types";

// Sources: CV v5 ("UI and marketing site designs"), implementation plan section 4.
// The v2 description and tags were copied from Moonwave, so they are not reused here.
export const brickly: Project = {
  slug: "brickly",
  order: 4,
  name: "Brickly",
  category: "web-design",
  status: "live",
  year: null, // TODO(owner): year
  tagline: "Real-estate marketing site", // DRAFT
  summary: "TODO(owner): short description (old one was a copy of Moonwave's)",
  role: "TODO(owner): role",
  stack: [], // TODO(owner): real stack (v2 tags were a copy of Moonwave's)
  links: {
    live: "https://real-estate-web-design-gray.vercel.app",
    github: null, // TODO(owner): public repo or none
  },
  stats: null,
  xray: "simple",
};
