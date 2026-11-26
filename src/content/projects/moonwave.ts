import type { Project } from "../types";
import { shot } from "./media";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data.
// Media: copied from the v2 assets into public/images/projects/moonwave/ (full-page screenshot cut
// into four 1600px crops, plus the v2 screen recording).
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
  xray: "none", // TODO(owner): simple X-ray annotations need the real section and technique list (review decision 5: "or none")
  caseStudy: {
    hero: {
      src: "/images/projects/moonwave/moonwave-poster.webp",
      video: "/images/projects/moonwave/moonwave.mp4",
      alt: "Short screen recording of the Moonwave site scrolling through its hero section",
      width: 1600,
      height: 715,
    },
    // TODO(owner): describe each section in the alt text and caption.
    gallery: [1, 2, 3, 4].map((n) => ({
      caption: `Page capture, part ${n} of 4`,
      media: shot(
        `/images/projects/moonwave/moonwave-${n}.webp`,
        `Screenshot of the Moonwave site, part ${n} of 4 of the full-page capture`,
      ),
    })),
    story: [
      { id: "problem", title: "The brief", lead: "TODO(owner): what was the brief for Moonwave?", paragraphs: [], draft: true },
      {
        id: "approach",
        title: "The approach",
        lead: "TODO(owner): how the scroll-driven animation was designed and built, and what the AI tools (Nano Banana, Kling) were used for.",
        paragraphs: [],
        draft: true,
      },
      { id: "outcome", title: "The outcome", lead: "TODO(owner): result and what you learned.", paragraphs: [], draft: true },
    ],
    decisions: [],
    diagram: null,
  },
};
