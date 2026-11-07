import type { Site } from '@/content/site';
import { LinkIcon } from '@/components/Icons/Icons';
import styles from '../Services.module.scss';

export function AiAnswerSnippet({ snippets }: { snippets: Site['snippets'] }) {
  return (
    <figure aria-label={snippets.aiLabel} className={`${styles.snippet} ${styles.stack}`}>
      <p className={styles.bubble}>{snippets.aiQuestion}</p>
      <p className={styles.answer}>
        {snippets.aiAnswerBefore}
        <strong>{snippets.aiAnswerBrand}</strong>
        {snippets.aiAnswerAfter}
      </p>
      <span className={styles.source}>
        <LinkIcon />
        {snippets.aiSource}
      </span>
    </figure>
  );
}
