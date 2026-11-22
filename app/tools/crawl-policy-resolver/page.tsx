import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { CrawlPolicyResolver } from '@/components/CrawlPolicyResolver/CrawlPolicyResolver';
import styles from './page.module.scss';

const tool = site.tools.items[2];

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/crawl-policy-resolver/' },
  openGraph: {
    title: `${tool.title} · ${site.name}`,
    description: tool.description,
    url: '/tools/crawl-policy-resolver/',
  },
};

export default function CrawlPolicyResolverPage() {
  return (
    <>
      <h1 className={styles.title}>{tool.title}</h1>
      <p className={styles.intro}>{tool.intro}</p>
      <CrawlPolicyResolver
        resolveLabel={tool.resolveLabel}
        userAgentLabel={tool.userAgentLabel}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.title,
          description: tool.description,
          url: absoluteUrl('/tools/crawl-policy-resolver/'),
          applicationCategory: 'WebApplication',
          applicationSubCategory: 'Technical SEO',
          operatingSystem: 'Any',
          provider: {
            '@type': 'Organization',
            name: site.name,
            url: absoluteUrl('/'),
          },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: site.name, item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: absoluteUrl('/tools/') },
            { '@type': 'ListItem', position: 3, name: tool.title },
          ],
        }}
      />
    </>
  );
}
