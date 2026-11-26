import type { Project } from "../types";
import { shot } from "./media";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data, the public repo's package.json (checked 2026-11-26).
// Media: copied from the v2 assets into public/images/projects/moonwave/ (full-page screenshot cut
// into four 1600px crops, plus the v2 screen recording).
// Stack: Vite, React, TypeScript, Tailwind CSS and Lenis are in the repo's package.json; Nano Banana and Kling are the v2 tags.
// TODO(owner): the CV also lists GSAP and Framer Motion for the three sites, but neither is in this repo's dependencies.
export const moonwave: Project = {
  slug: "moonwave",
  order: 3,
  name: "Moonwave",
  category: "web-design",
  status: "live",
  year: null, // hidden by owner decision (2026-11-26); nothing renders a year
  tagline: "Creative studio marketing site with scroll-driven animation", // DRAFT
  summary: "A responsive marketing site for a fictional creative studio, built around a full-screen animated hero and smooth scrolling. A self-initiated design and build exercise with sample content, not a client project.",
  role: "Designed and built the site, using AI tools for the hero imagery and video.", // DRAFT: from the CV ("UI and marketing site designs") and the v2 tags (Nano Banana, Kling)
  stack: [
    { name: "React" },
    { name: "Vite" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" },
    { name: "Lenis" },
    { name: "Nano Banana", ai: true },
    { name: "Kling", ai: true },
  ],
  links: {
    live: "https://music-studio-web-design.vercel.app",
    github: "https://github.com/the-KW22/music-studio-web-design", // DRAFT: public repo whose homepage is the live URL (checked 2026-11-26); owner to confirm it should be linked
  },
  stats: null,
  xray: "none", // TODO(owner): simple X-ray annotations need the real section and technique list (review decision 5: "or none")
  caseStudy: {
    hero: {
      src: "/images/projects/moonwave/moonwave-poster.webp",
      video: "/images/projects/moonwave/moonwave.mp4",
      alt: "Screen recording of the Moonwave home page: the headline \"Craft that speaks louder than the noise.\" over a starry night sky, with three musicians playing keyboard, violin and guitar on the moon and glowing music notes drifting across the scene",
      width: 1600,
      height: 715,
    },
    // DRAFT captions and alt text, written from the screenshots. The page copy is sample content for a fictional studio.
    gallery: [
      {
        caption: "Hero",
        media: shot("/images/projects/moonwave/moonwave-1.webp", "Moonwave hero: a navigation bar with Home, Studio, About, Journal and Reach Us, the headline \"Craft that speaks louder than the noise.\" over a night sky, and musicians on the moon with glowing music notes"),
      },
      {
        caption: "Studio and about",
        media: shot("/images/projects/moonwave/moonwave-2.webp", "A split layout: a light panel describing the studio with three figures and a Tour the Studio button beside a close-up of a mixing desk, above a dark portrait panel and a navy panel reading \"We believe great work is born in stillness.\""),
      },
      {
        caption: "Team and journal",
        media: shot("/images/projects/moonwave/moonwave-3.webp", "The end of the about panel with a Meet the Team button, then a Journal section titled \"Thoughts from the studio.\" with three article cards showing headphones on sheet music, a studio monitor and a guitar neck"),
      },
      {
        caption: "Contact",
        media: shot("/images/projects/moonwave/moonwave-4.webp", "A navy contact section with a heading, an email address and location, and a form with name, email, subject and message fields"),
      },
    ],
    story: [
      {
        id: "problem",
        title: "The brief",
        lead: "A self-initiated design and build exercise, not client work. The studio, its work and its copy are sample content.",
        paragraphs: [],
        draft: false, // owner confirmed 2026-11-26
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: from the screenshots, the CV and the repo's package.json. How the animation works is still needed from the owner.
        lead: "A single-page marketing site for a creative studio, opening on a full-screen animated hero and scrolling through studio, about, journal and contact sections.",
        paragraphs: [
          "The site is built with React, Vite, TypeScript and Tailwind CSS, with Lenis for smooth scrolling. The hero imagery and video were made with AI tools (Nano Banana and Kling).", // DRAFT (repo package.json, v2 tags)
        ],
        draft: true,
      },
      {
        id: "outcome",
        title: "The outcome",
        // DRAFT
        lead: "A responsive marketing site, live on Vercel.",
        paragraphs: [], // TODO(owner): what you learned, or what you would change (checklist)
        draft: true,
      },
    ],
    decisions: [],
    diagram: null,
  },
};
