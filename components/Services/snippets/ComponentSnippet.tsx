import type { Site } from '@/content/site';
import styles from '../Services.module.scss';

// Colours JSX tag names ("<article", "</h3>", ">") in the accent colour.
function Line({ line }: { line: string }) {
  const parts = line.split(/(<\/?[a-z0-9]+|\/?>)/);
  return (
    <>
      {parts.map((part, i) =>
        /^<\/?[a-z0-9]+$|^\/?>$/.test(part) ? (
          <span key={i} className={styles.directive}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function ComponentSnippet({ snippets }: { snippets: Site['snippets'] }) {
  return (
    <figure aria-label={snippets.componentLabel} className={`${styles.snippet} ${styles.robots}`}>
      <div className={styles.fileBar}>
        <span className={styles.strong}>{snippets.componentFile}</span>
        <span>{snippets.componentLang}</span>
      </div>
      <pre className={styles.code}>
        {snippets.component.map((line, i) => (
          <span key={i} className={styles.codeLine}>
            <Line line={line} />
          </span>
        ))}
      </pre>
    </figure>
  );
}
