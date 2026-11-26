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
  email: "kwenleow@gmail.com",
  links: {
    github: "https://github.com/the-KW22",
    linkedin: null, // TODO(owner): LinkedIn URL (assets checklist section 3)
    resume: "/resume",
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
  replyTime: null, // TODO(owner): reply-time line (draft idea: "I reply within 2 working days")
  pastVersions: [
    { label: "v1", href: "/v1" },
    { label: "v2", href: "/v2" },
  ],
};
