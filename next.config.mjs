import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/developers/api-explorer', destination: '/developers/reference', permanent: true },
      { source: '/docs', destination: '/', permanent: true },
      { source: '/docs/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default withMDX(config);
