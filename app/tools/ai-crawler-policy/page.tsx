import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { AiCrawlerPolicy } from '@/components/AiCrawlerPolicy/AiCrawlerPolicy';
import styles from './page.module.scss';

const tool = site.tools.items[1];

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/ai-crawler-policy/' },
};

export default function AiCrawlerPolicyPage() {
  return (
    <>
      <h1 className={styles.title}>{tool.title}</h1>
      <p className={styles.intro}>{tool.intro}</p>
      <AiCrawlerPolicy
        searchLabel={tool.searchLabel}
        aiSearchLabel={tool.aiSearchLabel}
        aiTrainingLabel={tool.aiTrainingLabel}
        copyLabel={tool.copyLabel}
        copiedLabel={tool.copiedLabel}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.title,
            description: tool.description,
            url: absoluteUrl('/tools/ai-crawler-policy/'),
            applicationCategory: 'WebApplication',
            offers: { '@type': 'Offer', price: '0' },
          }),
        }}
      />
    </>
  );
}
