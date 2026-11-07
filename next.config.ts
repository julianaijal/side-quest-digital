import type { NextConfig } from 'next';

// Google Tag Manager and Google Analytics 4 are the only third parties.
const google = {
  script: 'https://www.googletagmanager.com',
  connect: 'https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com',
  img: 'https://*.google-analytics.com https://www.googletagmanager.com',
};

// Static prerendering rules out nonces, so inline scripts and styles are
// allowed. Everything else is locked to this origin.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${google.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${google.img}`,
  "font-src 'self'",
  `connect-src 'self' ${google.connect}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

// Cache Components stays off: the page is fully static, and OpenNext on
// Workers serves it from build output. Revisit with the headless CMS.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // One page, mostly first time visitors and small CSS: inlining removes
    // the render blocking stylesheet request.
    inlineCss: true,
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // HTML and other unhashed responses: always revalidate, so a deploy
        // shows up at once. Hashed files under /_next/static keep Next's
        // immutable header.
        source: '/((?!_next/static).*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</llms.txt>; rel="alternate"; type="text/plain", </sitemap.xml>; rel="sitemap"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
