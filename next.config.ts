import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

const nextConfig: NextConfig = {
  // Styled 404 for URLs that match no route (the app has two root layouts, so no root not-found).
  experimental: { globalNotFound: true },
  env: {
    // "1" once the owner has put the CV at public/resume.pdf; the CV buttons are hidden until then.
    NEXT_PUBLIC_HAS_RESUME: existsSync(join(process.cwd(), "public", "resume.pdf")) ? "1" : "",
  },
  async redirects() {
    return [
      // Old ver 2.0 pages are sections of the ver 3.0 one-page home. Sources are exact
      // paths, so /v1/* and /v2/* (including /v2/about-me and /v2/contact-me) never match.
      { source: "/about-me", destination: "/#about", permanent: true },
      { source: "/contact-me", destination: "/#contact", permanent: true },
    ];
  },
  async headers() {
    // Archives stay out of search results. v1 is static HTML and v2 already has a meta tag;
    // the header covers both (and every asset under them) without touching their files.
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/v1", headers: noindex },
      { source: "/v1/:path*", headers: noindex },
      { source: "/v2", headers: noindex },
      { source: "/v2/:path*", headers: noindex },
      { source: "/resume", headers: noindex },
    ];
  },
  async rewrites() {
    return [
      // v1 is the original static (Vite) site, built into public/v1.
      { source: "/v1", destination: "/v1/index.html" },
    ];
  },
};

export default nextConfig;
