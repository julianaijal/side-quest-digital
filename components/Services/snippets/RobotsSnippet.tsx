import type { Site } from '@/content/site';
import styles from '../Services.module.scss';

export function RobotsSnippet({ snippets }: { snippets: Site['snippets'] }) {
  return (
    <figure aria-label={snippets.robotsLabel} className={`${styles.snippet} ${styles.robots}`}>
      <div className={styles.fileBar}>
        <span className={styles.strong}>{snippets.robotsFile}</span>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          {snippets.robotsStatus}
        </span>
      </div>
      <pre className={styles.code}>
        {snippets.robots.map((line, i) => (
          <span key={i} className={styles.codeLine}>
            <span className={styles.lineNumber} aria-hidden="true">
              {i + 1}
            </span>
            {line || ' '}
          </span>
        ))}
      </pre>
    </figure>
  );
}
