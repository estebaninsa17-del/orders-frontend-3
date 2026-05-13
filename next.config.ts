import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://orders-api-1-j4jm.onrender.com/api/v1/:path*'
      }
    ];
  }
};

export default nextConfig;
