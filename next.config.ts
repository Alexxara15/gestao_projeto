import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second (reduces constant cpu load from events)
        aggregateTimeout: 300, // Delay before rebuilding
        ignored: /node_modules|\.next|\.git/, // Ignore heavy folders
      };
    }
    return config;
  },
};

export default nextConfig;
