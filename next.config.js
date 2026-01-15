/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: true, // Required for Netlify
  },
  // Add this for Netlify compatibility
  output: 'standalone',
};

module.exports = nextConfig;