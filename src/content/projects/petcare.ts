import type { Project } from "../types";
import { shot } from "./media";
import { petcareHeroXray } from "./xray";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data, plan section 4.
// Media: copied from the v2 assets into public/images/projects/petcare/.
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
  xray: "simple", // hero screenshot carries petcareHeroXray
  caseStudy: {
    hero: {
      ...shot("/images/projects/petcare/petcare-1.webp", "Screenshot of the PetCare landing page, first screen", 1600, 775),
      xray: petcareHeroXray,
    },
    // TODO(owner): describe each section in the alt text and caption.
    gallery: [2, 3, 4, 5, 6].map((n) => ({
      caption: `Landing page, screen ${n} of 6`,
      media: shot(
        `/images/projects/petcare/petcare-${n}.webp`,
        `Screenshot of the PetCare landing page, screen ${n} of 6`,
        1600,
        775,
      ),
    })),
    story: [
      { id: "problem", title: "The brief", lead: "TODO(owner): what was the brief for PetCare?", paragraphs: [], draft: true },
      {
        id: "approach",
        title: "The approach",
        // DRAFT (v2 note: design-only project; the live demo is a static build of the Figma mockup)
        lead: "A design-only project: the live page is a static build of the Figma mockup.",
        paragraphs: [],
        draft: true,
      },
      { id: "outcome", title: "The outcome", lead: "TODO(owner): result and what you learned.", paragraphs: [], draft: true },
    ],
    decisions: [],
    diagram: null,
  },
};
