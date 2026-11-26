import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { projects } from "@/content/projects";

// Update this date when site content meaningfully changes.
const LAST_MODIFIED = new Date("2026-11-26");

// /about-me and /contact-me now redirect to /#about and /#contact, so they are not listed.
// Case studies are generated from src/content/projects.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
