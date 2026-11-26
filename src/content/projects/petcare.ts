import type { Project } from "../types";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data, plan section 4.
export const petcare: Project = {
  slug: "petcare",
  order: 5,
  name: "PetCare",
  category: "web-design",
  status: "live",
  year: null, // TODO(owner): year
  tagline: "Pet shop site with services, packages and a booking form", // DRAFT
  summary:
    // DRAFT (v2 note: design-only project; the live demo is a static build of the Figma mockup)
    "A pet shop landing page design, built as a static implementation of the Figma mockup.",
  role: "TODO(owner): role",
  stack: [
    { name: "Next.js" },
    { name: "Tailwind CSS" },
    { name: "shadcn/ui" },
    { name: "Lenis" },
  ],
  links: {
    live: "https://pet-shop-web-template.vercel.app",
    github: null, // TODO(owner): public repo or none
  },
  stats: null,
  xray: "simple",
};
