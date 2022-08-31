/** @type {import('next').NextConfig} */
const nextConfig = {
  // need to disable for react-beautiful-dnd to work
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;
