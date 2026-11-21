import type { Metadata } from 'next';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';
import { RenderingTimer } from '@/components/RenderingTimer/RenderingTimer';
import styles from './page.module.scss';

const tool = site.tools.items[0];

export const metadata: Metadata = {
  title: `${tool.title} · ${site.name}`,
  description: tool.description,
  alternates: { canonical: '/tools/rendering-timer/' },
};

export default function RenderingTimerPage() {
  return (
    <>
      <h1 className={styles.title}>{tool.title}</h1>
      <p className={styles.intro}>{tool.intro}</p>
      <p className={styles.auto}>{tool.autoDescription}</p>
      <RenderingTimer
        startLabel={tool.startLabel}
        resetLabel={tool.resetLabel}
        completeLabel={tool.completeLabel}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.title,
            description: tool.description,
            url: absoluteUrl('/tools/rendering-timer/'),
            applicationCategory: 'WebApplication',
            offers: { '@type': 'Offer', price: '0' },
          }),
        }}
      />
    </>
  );
}
