import type { NextConfig } from 'next';

// Cache Components stays off: the page is fully static, and OpenNext on
// Workers serves it from build output. Revisit with the headless CMS.
const nextConfig: NextConfig = {};

export default nextConfig;
