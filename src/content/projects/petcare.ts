import type { Project } from "../types";
import { shot } from "./media";
import { petcareHeroXray } from "./xray";

// Sources: CV v5 ("UI and marketing site designs"), v2 project data, plan section 4, the public repo's package.json (checked 2026-11-26).
// Media: copied from the v2 assets into public/images/projects/petcare/.
export const petcare: Project = {
  slug: "petcare",
  order: 5,
  name: "PetCare",
  category: "web-design",
  status: "live",
  year: 2026, // DRAFT: the public repo was created 2026-01-25; owner to confirm
  tagline: "Pet shop site with services, packages and a booking form", // DRAFT
  summary:
    // DRAFT (v2 note: design-only project; the live demo is a static build of the Figma mockup)
    "A pet shop landing page with services, pricing packages, testimonials and a booking form. A design-only project: the live page is a static build of the Figma mockup.",
  role: "Designed the page in Figma and built it as a static front end.", // DRAFT: from the v2 note and the CV; owner to confirm the Figma design was his own
  stack: [
    { name: "Next.js" },
    { name: "Tailwind CSS" },
    { name: "shadcn/ui" },
    { name: "Lenis" },
  ],
  links: {
    live: "https://pet-shop-web-template.vercel.app",
    github: "https://github.com/the-KW22/pet-shop-web-template", // DRAFT: public repo "A pet shop web template." whose homepage is the live URL (checked 2026-11-26); owner to confirm it should be linked
  },
  stats: null,
  xray: "simple", // hero screenshot carries petcareHeroXray
  caseStudy: {
    hero: {
      ...shot("/images/projects/petcare/petcare-1.webp", "PetCare hero: a header with Home, Services, Packages, Testimonials, Contact and a Book Appointment button, the headline \"Your Furry Friend Deserve the Best!\" with two buttons, and a photo of a resting dog with floating paw-print badges", 1600, 775),
      xray: petcareHeroXray,
    },
    // DRAFT captions and alt text, written from the screenshots. The page copy and prices are sample content.
    gallery: [
      { n: 2, caption: "Achievements", alt: "PetCare achievements section: the heading \"Why Pet Parents Trust Us\", three badges (Certified Groomers, Top Rated 2025, Premium Service) and four figure cards for pets served, five-star reviews, hotel care hours and groomers" },
      { n: 3, caption: "Services", alt: "PetCare services section: the heading \"Premium Pet Care Services\" over cards for Grooming, Nail Cutting and Pet Hotel, each with an icon, a short description, a starting price range in ringgit and a Book Now button" },
      { n: 4, caption: "Packages", alt: "PetCare pricing packages: Basic Care, a highlighted Complete Care card marked Most Popular, and Premium Stay, each with a price, a checklist of what is included and a call-to-action button" },
      { n: 5, caption: "Testimonials", alt: "PetCare testimonials: cards of short reviews written from the pets' point of view, each with a pet photo, name, breed and a star rating" },
      { n: 6, caption: "Booking form", alt: "PetCare booking form headed \"Get in Touch\", with owner information, pet information and service detail fields inside a single rounded card" },
    ].map(({ n, caption, alt }) => ({
      caption,
      media: shot(`/images/projects/petcare/petcare-${n}.webp`, alt, 1600, 775),
    })),
    story: [
      {
        id: "problem",
        title: "The brief",
        lead: "TODO(owner): what was the brief for PetCare? Was it a self-set exercise or for someone?",
        paragraphs: [],
        draft: true,
      },
      {
        id: "approach",
        title: "The approach",
        // DRAFT (v2 note: design-only project; the live demo is a static build of the Figma mockup)
        lead: "A design-only project: the live page is a static build of the Figma mockup.",
        paragraphs: [
          "The page runs from a hero through achievements, services, packages and testimonials to a booking form. It is built with Next.js, Tailwind CSS and shadcn/ui-style components, with Lenis for smooth scrolling.", // DRAFT (screenshots, repo package.json)
        ],
        draft: true,
      },
      {
        id: "outcome",
        title: "The outcome",
        // DRAFT
        lead: "A responsive pet shop landing page, live on Vercel.",
        paragraphs: [], // TODO(owner): what you learned, or what you would change (checklist)
        draft: true,
      },
    ],
    decisions: [],
    diagram: null,
  },
};
