/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allows production builds to successfully complete even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to successfully complete even if there are ESLint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;