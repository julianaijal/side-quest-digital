import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { RenderingTimer } from '@/components/RenderingTimer/RenderingTimer';
import { CopyUrl } from '@/components/RenderingTimer/CopyUrl';
import styles from './page.module.scss';

const tool = site.tools.items[0];
const autoUrl = absoluteUrl('/tools/rendering-timer/?auto');

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/rendering-timer/' },
  openGraph: {
    title: `${tool.title} · ${site.name}`,
    description: tool.description,
    url: '/tools/rendering-timer/',
  },
};

export default function RenderingTimerPage() {
  return (
    <>
      <h1 className={styles.title}>{tool.title}</h1>
      <p className={styles.intro}>{tool.intro}</p>
      <p className={styles.auto}>{tool.autoDescription}</p>
      <CopyUrl
        url={autoUrl}
        label={tool.copyLabel}
        copiedLabel={tool.copiedLabel}
      />
      <RenderingTimer
        startLabel={tool.startLabel}
        resetLabel={tool.resetLabel}
        completeLabel={tool.completeLabel}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: tool.title,
              description: tool.description,
              url: absoluteUrl('/tools/rendering-timer/'),
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
