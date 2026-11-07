import type { Site } from '@/content/site';
import styles from './Steps.module.scss';

export function Steps({ site }: { site: Site }) {
  const { steps } = site;
  const last = steps.items.length - 1;
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{steps.eyebrow}</p>
          <h2 id="process-title" className={styles.heading}>
            {steps.title}
          </h2>
        </div>
        <div className={styles.track}>
          <div className={styles.line} aria-hidden="true" />
          <ol className={styles.list}>
            {steps.items.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <span className={`${styles.circle} ${i === last ? styles.final : ''}`}>{i + 1}</span>
                <div className={styles.content}>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.text}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
