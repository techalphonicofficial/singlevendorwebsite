/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "standalone",
  reactStrictMode: true,
  output: 'standalone',


  images: {
    domains: [
      "images.unsplash.com"
    ],
  },

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