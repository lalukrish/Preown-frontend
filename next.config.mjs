/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // ✅ Local Strapi (for development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // ✅ Production Strapi
      {
        protocol: 'https',
        hostname: 'strapi.preown.store',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
