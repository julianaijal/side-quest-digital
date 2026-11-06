import type { ReactNode } from 'react';
import type { ServiceItem, Site } from '@/content/site';
import { ChartIcon, CodeIcon, SearchIcon, SparkleIcon } from '@/components/Icons/Icons';
import { AiAnswerSnippet } from './snippets/AiAnswerSnippet';
import { DashboardSnippet } from './snippets/DashboardSnippet';
import { RobotsSnippet } from './snippets/RobotsSnippet';
import { WebVitalsSnippet } from './snippets/WebVitalsSnippet';
import styles from './Services.module.scss';

const icons: Record<ServiceItem['snippet'], ReactNode> = {
  robots: <SearchIcon className={styles.icon} />,
  'ai-answer': <SparkleIcon className={styles.icon} />,
  'web-vitals': <CodeIcon className={styles.icon} />,
  dashboard: <ChartIcon className={styles.icon} />,
};

const snippetsById = {
  robots: RobotsSnippet,
  'ai-answer': AiAnswerSnippet,
  'web-vitals': WebVitalsSnippet,
  dashboard: DashboardSnippet,
} as const;

export function ServiceCard({ item, snippets }: { item: ServiceItem; snippets: Site['snippets'] }) {
  const Snippet = snippetsById[item.snippet];
  const tags = 'tags' in item ? item.tags : undefined;

  const body = (
    <>
      <span className={styles.iconTile}>{icons[item.snippet]}</span>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.text}>{item.text}</p>
    </>
  );

  if (item.wide) {
    return (
      <article className={`${styles.card} ${styles.wide}`}>
        <div className={styles.cardBody}>
          {body}
          {tags && (
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Snippet snippets={snippets} />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      {body}
      <Snippet snippets={snippets} />
    </article>
  );
}
