import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// The new site is crawlable. /v1 and /v2 are archives: they are kept OUT of the index with noindex
// (a meta tag in v2, an X-Robots-Tag header from next.config.ts for v1 and v2). They are deliberately
// not Disallowed here, because a crawler that cannot fetch a page never sees its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
