// File: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
  compiler: {
    removeConsole: false,
  },
  // Keep framer-motion animations in production
  transpilePackages: ['framer-motion'],
};

export default nextConfig;