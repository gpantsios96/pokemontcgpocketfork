import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for traditional hosting
  output: 'export',

  // Disable image optimization for static exports (will use unoptimized images)
  images: {
    unoptimized: true,
  },

  // Optional: Configure trailing slashes for better compatibility
  trailingSlash: true,

  // Optional: Base path if deploying to a subdirectory
  // basePath: '',
};

export default nextConfig;
