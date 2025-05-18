import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['serpapi.com'], // Include the hostname for external images
  },
};

export default nextConfig;

