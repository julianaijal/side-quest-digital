import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { AiCrawlerPolicy } from '@/components/AiCrawlerPolicy/AiCrawlerPolicy';
import { crawlers } from '@/components/AiCrawlerPolicy/crawlers';
import { crawlerDocs } from '@/lib/crawler-docs';
import styles from './page.module.scss';

const tool = site.tools.items[1];

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/ai-crawler-policy/' },
  openGraph: {
    title: `${tool.title} · ${site.name}`,
    description: tool.description,
    url: '/tools/ai-crawler-policy/',
  },
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
      <section className={styles.crawlers} aria-labelledby="crawlers-title">
        <h2 id="crawlers-title" className={styles.crawlersTitle}>
          {tool.crawlersTitle}
        </h2>
        <p className={styles.crawlersNote}>{tool.crawlersNote}</p>
        <p className={styles.crawlersCount}>
          {crawlers.length} user agents from{' '}
          {new Set(crawlers.map((c) => c.operator)).size} operators
        </p>
        {(['training', 'search', 'both'] as const).map((purpose) => {
          const group = crawlers.filter((c) => c.purpose === purpose);
          const label =
            purpose === 'search'
              ? tool.crawlersSearchLabel
              : purpose === 'training'
                ? tool.crawlersTrainingLabel
                : tool.crawlersBothLabel;
          const description =
            purpose === 'search'
              ? tool.crawlersSearchDescription
              : purpose === 'training'
                ? tool.crawlersTrainingDescription
                : tool.crawlersBothDescription;
          return (
            <div key={purpose} className={styles.crawlerGroup}>
              <h3 className={styles.crawlerGroupTitle}>
                {label}
                <span className={styles.crawlerGroupCount}>{group.length}</span>
              </h3>
              <p className={styles.crawlerGroupDescription}>{description}</p>
              <table className={styles.crawlerTable}>
                <thead>
                  <tr>
                    <th>User agent</th>
                    <th>Operator</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((crawler) => (
                    <tr key={crawler.name}>
                      <td className={styles.crawlerName}>{crawler.name}</td>
                      <td>{crawler.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      <section className={styles.resources} aria-labelledby="resources-title">
        <h2 id="resources-title" className={styles.resourcesTitle}>
          {tool.resourcesTitle}
        </h2>
        <p className={styles.resourcesNote}>{tool.resourcesNote}</p>
        <ul className={styles.resourcesList}>
          {crawlerDocs.map((doc) => (
            <li key={doc.operator}>
              <a href={doc.url} rel="noopener noreferrer" target="_blank">
                {doc.operator}
              </a>
              <span className={styles.resourcesDetail}>{doc.note}</span>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: tool.title,
              description: tool.description,
              url: absoluteUrl('/tools/ai-crawler-policy/'),
              applicationCategory: 'WebApplication',
              applicationSubCategory: 'Technical SEO',
              operatingSystem: 'Any',
              provider: {
                '@type': 'Organization',
                name: site.name,
                url: absoluteUrl('/'),
              },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: site.name, item: absoluteUrl('/') },
                { '@type': 'ListItem', position: 2, name: 'Tools', item: absoluteUrl('/tools/') },
                { '@type': 'ListItem', position: 3, name: tool.title },
              ],
            },
          ],
        }}
      />
    </>
  );
}
