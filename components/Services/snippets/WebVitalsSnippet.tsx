import type { Site } from '@/content/site';
import styles from '../Services.module.scss';

export function WebVitalsSnippet({ snippets }: { snippets: Site['snippets'] }) {
  return (
    <figure aria-label={snippets.vitalsLabel} className={`${styles.snippet} ${styles.stack}`}>
      <figcaption className={styles.caption}>{snippets.vitalsCaption}</figcaption>
      {snippets.vitals.map((row) => (
        <div key={row.metric} className={styles.vital}>
          <strong>{row.metric}</strong>
          <span className={styles.bar} aria-hidden="true" />
          <span className={styles.threshold}>{row.threshold}</span>
        </div>
      ))}
    </figure>
  );
}
