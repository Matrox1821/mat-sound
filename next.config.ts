import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "1024mb",
    },
    viewTransition: true,
    imgOptTimeoutInSeconds: 20000,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-c0650d223aea438f8e7e6d297faff72b.r2.dev",
      },
    ],
    qualities: [25, 50, 75],
  },
};

export default nextConfig;
