import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

// All crawlers are welcome, AI crawlers included.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
