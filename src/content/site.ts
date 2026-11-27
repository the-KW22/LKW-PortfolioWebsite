import type { SiteConfig } from "./types";

/** Canonical origin. Override with NEXT_PUBLIC_SITE_URL (for example on preview deployments). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lkw22studio.com";

export const site: SiteConfig = {
  url: SITE_URL,
  name: "Leow Kai Wen",
  brand: "LKW22 Studio",
  headline: "Full-Stack Developer | AI Engineer",
  location: "Kuala Lumpur, Malaysia",
  timezone: "Asia/Kuala_Lumpur",
  email: "kwenleow@gmail.com", // from the CV; the phone number is deliberately not published
  links: {
    github: "https://github.com/the-KW22",
    linkedin: null, // owner has no LinkedIn (decided 2026-11-26); the button stays hidden everywhere
  },
  availability: "open",
  availabilityCopy: {
    open: "Open to work", // DRAFT
    "freelance-only": "Open to freelance", // DRAFT
    closed: "Not taking new work", // DRAFT
  },
  atlasNote: {
    open: "Open to full-time, freelance and custom builds", // DRAFT
    "freelance-only": "Open to freelance and custom builds", // DRAFT
    closed: "Not taking new work right now", // DRAFT
  },
  replyTime: null, // owner decided on 2026-11-26 to leave the reply-time line out
  pastVersions: [
    { label: "v1", href: "/v1" },
    { label: "v2", href: "/v2" },
  ],
};
