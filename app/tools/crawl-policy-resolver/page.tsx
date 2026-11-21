import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { CrawlPolicyResolver } from '@/components/CrawlPolicyResolver/CrawlPolicyResolver';
import styles from './page.module.scss';

const tool = site.tools.items[2];

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/crawl-policy-resolver/' },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.title,
            description: tool.description,
            url: absoluteUrl('/tools/crawl-policy-resolver/'),
            applicationCategory: 'WebApplication',
            offers: { '@type': 'Offer', price: '0' },
          }),
        }}
      />
    </>
  );
}
