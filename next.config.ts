import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'imgs.mongabay.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.getyourguide.com',
      },
      {
        protocol: 'https',
        hostname: 'flyingravana.eme-devops.com',
      },
      {
        protocol: 'https',
        hostname: 'www.trawell.in',
      },
      {
        protocol: 'https',
        hostname: 'greenholidaytravel.com',
      },
    ],
  },
};

export default nextConfig;
