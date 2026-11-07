import type { NextConfig } from 'next';

// Cache Components stays off: the page is fully static, and OpenNext on
// Workers serves it from build output. Revisit with the headless CMS.
const nextConfig: NextConfig = {
  experimental: {
    // One page, mostly first time visitors and small CSS: inlining removes
    // the render blocking stylesheet request.
    inlineCss: true,
  },
};

export default nextConfig;
