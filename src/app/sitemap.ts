import type { MetadataRoute } from "next";

// Update this date when site content meaningfully changes.
const LAST_MODIFIED = new Date("2026-11-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leowkaiwen.dev";

  return [
    {
      url: base,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/about-me`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/contact-me`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
