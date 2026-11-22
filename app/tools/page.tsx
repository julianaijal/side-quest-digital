import type { Metadata } from 'next';
import Link from 'next/link';
import { site as content } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: content.tools.meta.title,
  description: content.tools.meta.description,
  alternates: { canonical: '/tools/' },
  openGraph: {
    title: content.tools.meta.title,
    description: content.tools.meta.description,
    url: '/tools/',
  },
};

export default function Tools() {
  const { tools } = content;
  return (
    <>
      <h1 className={styles.title}>{tools.title}</h1>
      <p className={styles.intro}>{tools.intro}</p>
      <ul className={styles.grid}>
        {tools.items.map((item) => (
          <li key={item.slug}>
            <Link href={`/tools/${item.slug}/`} className={styles.card}>
              <span className={styles.chip}>{item.tag}</span>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardText}>{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: tools.title,
          description: content.tools.meta.description,
          url: absoluteUrl('/tools/'),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: tools.items.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/tools/${item.slug}/`),
              name: item.title,
            })),
          },
        }}
      />
    </>
  );
}
