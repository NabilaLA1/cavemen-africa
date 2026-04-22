import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Project directory (avoids wrong Turbopack root when parent folders have other lockfiles). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/asali-open-mic",
        destination: "/asali",
        permanent: true,
      },
      {
        source: "/asali-open-mic/:path*",
        destination: "/asali/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
