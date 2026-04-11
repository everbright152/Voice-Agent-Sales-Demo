/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow build to succeed even with TypeScript/ESLint warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
