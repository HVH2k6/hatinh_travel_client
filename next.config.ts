/** @type {import('next').NextConfig} */

const nextConfig = {
   images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: '**', // Cho phép mọi domain HTTPS
          },
          {
              protocol: 'http',
              hostname: '**', // Cho phép mọi domain HTTP
          }
      ]
  }
};

export default nextConfig;