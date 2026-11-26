import type { Project } from "../types";
import { shot } from "./media";

// Sources: CV v5 ("UI and marketing site designs"), implementation plan section 4.
// The v2 description and tags were copied from Moonwave, so they are not reused here.
// Media: copied from the v2 assets into public/images/projects/brickly/.
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
  xray: "none", // TODO(owner): simple X-ray annotations need the real section and technique list (review decision 5: "or none")
  caseStudy: {
    hero: {
      src: "/images/projects/brickly/brickly-poster.webp",
      video: "/images/projects/brickly/brickly.mp4",
      alt: "Short screen recording of the Brickly site scrolling through its hero section",
      width: 1600,
      height: 735,
    },
    // TODO(owner): describe each section in the alt text and caption.
    gallery: [1, 2, 3, 4].map((n) => ({
      caption: `Page capture, part ${n} of 4`,
      media: shot(
        `/images/projects/brickly/brickly-${n}.webp`,
        `Screenshot of the Brickly site, part ${n} of 4 of the full-page capture`,
      ),
    })),
    story: [
      { id: "problem", title: "The brief", lead: "TODO(owner): what was the brief for Brickly?", paragraphs: [], draft: true },
      { id: "approach", title: "The approach", lead: "TODO(owner): design and build approach, and the real stack.", paragraphs: [], draft: true },
      { id: "outcome", title: "The outcome", lead: "TODO(owner): result and what you learned.", paragraphs: [], draft: true },
    ],
    decisions: [],
    diagram: null,
  },
};
