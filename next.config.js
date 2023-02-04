/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/tasks',
        destination: '/tasks/inbox',
      },
    ];
  },
};

module.exports = nextConfig;
