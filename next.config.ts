import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during production builds
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude dashboard directory
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/src/app/dashboard/**'],
    };
    return config;
  },
};

export default nextConfig;
