/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1-proxy/:path*',
        destination: 'https://mybiography.in/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
