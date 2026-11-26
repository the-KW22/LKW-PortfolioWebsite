import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

/** One description for the site, written from facts in src/content/site.ts and the About copy. */
export const SITE_TITLE = `${site.name}: Full-Stack Developer and AI Engineer`;
export const SITE_DESCRIPTION = `Portfolio of ${site.name}, a full-stack developer and AI engineer in ${site.location}. Production web and AI products, built end to end with Next.js, Spring Boot, PostgreSQL and the Claude API.`;
export const SITE_NAME = `${site.name} Portfolio`;

interface PageMetaInput {
  /** Plain title; the layout template appends " | Leow Kai Wen". Omit for the home page. */
  title?: string;
  description: string;
  /** Path on the site, starting with "/" ("/" for home). */
  path: string;
  type?: "website" | "article";
}

/**
 * Full Metadata for one page. Next.js replaces (not merges) openGraph and twitter objects set on a
 * page, so every page builds the complete set here: canonical, Open Graph and Twitter card stay
 * consistent. The share image comes from the nearest opengraph-image file (app/(site)/opengraph-image
 * for the site, projects/[slug]/opengraph-image for case studies).
 */
export function pageMeta({ title, description, path, type = "website" }: PageMetaInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const shareTitle = title ? `${title} | ${site.name}` : SITE_TITLE;
  return {
    ...(title ? { title } : { title: { absolute: SITE_TITLE } }),
    description,
    alternates: { canonical: url },
    openGraph: { type, url, title: shareTitle, description, siteName: SITE_NAME, locale: "en_MY" },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

/** Serialise JSON-LD for a script tag; "<" is escaped so content can never close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
