import type { ReactNode } from 'react';
import type { ServiceItem, Site } from '@/content/site';
import { ChartIcon, CodeIcon, SearchIcon, SparkleIcon } from '@/components/Icons/Icons';
import { AiAnswerSnippet } from './snippets/AiAnswerSnippet';
import { DashboardSnippet } from './snippets/DashboardSnippet';
import { RobotsSnippet } from './snippets/RobotsSnippet';
import { ComponentSnippet } from './snippets/ComponentSnippet';
import styles from './Services.module.scss';

const icons: Record<ServiceItem['snippet'], ReactNode> = {
  robots: <SearchIcon className={styles.icon} />,
  'ai-answer': <SparkleIcon className={styles.icon} />,
  component: <CodeIcon className={styles.icon} />,
  dashboard: <ChartIcon className={styles.icon} />,
};

const snippetsById = {
  robots: RobotsSnippet,
  'ai-answer': AiAnswerSnippet,
  component: ComponentSnippet,
  dashboard: DashboardSnippet,
} as const;

export function ServiceCard({ item, snippets }: { item: ServiceItem; snippets: Site['snippets'] }) {
  const Snippet = snippetsById[item.snippet];
  const body = (
    <>
      {icons[item.snippet]}
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.text}>{item.text}</p>
    </>
  );

  if (item.wide) {
    return (
      <article className={`${styles.card} ${styles.wide}`}>
        <div className={styles.cardBody}>
          {body}
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
