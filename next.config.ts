import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1024mb",
    },
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c0650d223aea438f8e7e6d297faff72b.r2.dev",
      },
    ],
  },
};

export default nextConfig;
