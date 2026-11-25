import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // v1 is the original static (Vite) site, built into public/v1.
      { source: "/v1", destination: "/v1/index.html" },
    ];
  },
};

export default nextConfig;
