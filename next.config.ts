import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
