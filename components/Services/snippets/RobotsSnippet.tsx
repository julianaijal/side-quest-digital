import type { Site } from '@/content/site';
import styles from '../Services.module.scss';

// Colours the directive ("User-agent:", "Disallow:") of each robots.txt line.
function Line({ line }: { line: string }) {
  const colon = line.indexOf(':');
  if (colon === -1) return <>{line || ' '}</>;
  return (
    <>
      <span className={styles.directive}>{line.slice(0, colon + 1)}</span>
      {line.slice(colon + 1)}
    </>
  );
}

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
            <Line line={line} />
          </span>
        ))}
      </pre>
    </figure>
  );
}
