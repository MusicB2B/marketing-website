import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A verification build can be sent somewhere other than .next, so it never
  // clobbers the build cache of a dev server that is already running.
  // See the `build:check` script in package.json.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

export default nextConfig;
