import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@prisma/client": "@prisma/client",
    },
  },

  experimental: {
    turbopackFileSystemCacheForDev: true,

    serverActions: {
      bodySizeLimit: "10mb",
    },
    viewTransition: true,
  },
  serverExternalPackages: ["sharp", "@prisma/client", "@prisma/extension-accelerate"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c0650d223aea438f8e7e6d297faff72b.r2.dev",
      },
    ],
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
