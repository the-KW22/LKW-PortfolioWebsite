import type { Project } from "../types";
import { shot } from "./media";

// Sources: CV v5 ("UI and marketing site designs"), implementation plan section 4, the public repo's package.json (checked 2026-11-26).
// The v2 description and tags were copied from Moonwave, so they are not reused here.
// Media: copied from the v2 assets into public/images/projects/brickly/.
export const brickly: Project = {
  slug: "brickly",
  order: 4,
  name: "Brickly",
  category: "web-design",
  status: "live",
  year: null, // hidden by owner decision (2026-11-26); nothing renders a year
  tagline: "Real-estate marketing site", // DRAFT
  summary: "A responsive real-estate marketing site with a glass-style hero, property listings, agent profiles and a journal. A self-initiated design and build exercise with sample content, not a client project.",
  role: "Designed and built the site.", // DRAFT: from the CV ("UI and marketing site designs"); owner to add whether AI tools were used
  stack: [
    // From the public repo's package.json (React, Vite, TypeScript, Tailwind CSS, GSAP, Motion, Lenis).
    // TODO(owner): did you use AI image or video tools for the hero, as for Moonwave? If so add them here.
    { name: "React" },
    { name: "Vite" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" },
    { name: "GSAP" },
    { name: "Motion" },
    { name: "Lenis" },
  ],
  links: {
    live: "https://real-estate-web-design-gray.vercel.app",
    github: "https://github.com/the-KW22/real-estate-web-design", // DRAFT: public repo whose homepage is the live URL (checked 2026-11-26); owner to confirm it should be linked
  },
  stats: null,
  xray: "none", // TODO(owner): simple X-ray annotations need the real section and technique list (review decision 5: "or none")
  caseStudy: {
    hero: {
      src: "/images/projects/brickly/brickly-poster.webp",
      video: "/images/projects/brickly/brickly.mp4",
      alt: "Screen recording of the Brickly home page: a frosted-glass card with the headline \"Find Your Place to Call Home\" and Browse Listings and Meet Our Agents buttons, over a modern house beside a pool with city towers behind it",
      width: 1600,
      height: 735,
    },
    // DRAFT captions and alt text, written from the screenshots. The page copy is sample content.
    gallery: [
      {
        caption: "Hero",
        media: shot("/images/projects/brickly/brickly-1.webp", "Brickly hero: a rounded navigation bar with Home, About, Properties, Agents, Blog and a search field, a Contact Us button, and a frosted-glass card with the headline \"Find Your Place to Call Home\" over a house, pool and city towers, with a ticker of figures along the bottom"),
      },
      {
        caption: "Agents",
        media: shot("/images/projects/brickly/brickly-2.webp", "Three black-and-white agent portrait cards, each with a role, a name and a short biography: a co-founder and managing broker, a senior buyer's agent and a luxury listings specialist"),
      },
      {
        caption: "Listings and featured agent",
        media: shot("/images/projects/brickly/brickly-3.webp", "The bottom of a dark listings band with three property cards showing bedrooms, bathrooms and area, and a View All Listings button, followed by an Our Agents section headed \"Experts you can actually trust.\" and the start of a featured agent card"),
      },
      {
        caption: "Journal",
        media: shot("/images/projects/brickly/brickly-4.webp", "A Journal section headed \"Insights for every step of the journey.\" with a large article card over a night city skyline and two smaller article cards, one with a city street and one with a living room"),
      },
    ],
    story: [
      {
        id: "problem",
        title: "The brief",
        lead: "A self-initiated design and build exercise, not client work. The agency, listings and agents are sample content.",
        paragraphs: [],
        draft: false, // owner confirmed 2026-11-26
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT: from the screenshots and the repo's package.json. The design reasoning is still needed from the owner.
        lead: "A real-estate marketing site that leads with a frosted-glass hero and moves through listings, agent profiles and a journal.",
        paragraphs: [
          "The site is built with React, Vite, TypeScript and Tailwind CSS, with GSAP and Motion for animation and Lenis for smooth scrolling.", // DRAFT (repo package.json)
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
