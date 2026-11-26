import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old ver 2.0 pages are sections of the ver 3.0 one-page home. Sources are exact
      // paths, so /v1/* and /v2/* (including /v2/about-me and /v2/contact-me) never match.
      { source: "/about-me", destination: "/#about", permanent: true },
      { source: "/contact-me", destination: "/#contact", permanent: true },
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
