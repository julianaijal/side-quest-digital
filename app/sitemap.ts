import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/tools/'), changeFrequency: 'monthly', priority: 0.8 },
    ...site.tools.items.map((item) => ({
      url: absoluteUrl(`/tools/${item.slug}/`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
