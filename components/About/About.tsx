import Image from 'next/image';
import type { Site } from '@/content/site';
import { PersonIcon } from '@/components/Icons/Icons';
import styles from './About.module.scss';

export function About({ site }: { site: Site }) {
  const { about } = site;
  return (
    <section id="over" className={styles.section} aria-labelledby="over-title">
      <div className={styles.photo}>
        {about.photo ? (
          <Image
            src={about.photo}
            alt={about.photoAlt}
            fill
            sizes="(max-width: 640px) 100vw, 380px"
            className={styles.image}
          />
        ) : (
          <div role="img" aria-label={about.photoPlaceholderLabel} className={styles.placeholder}>
            <PersonIcon className={styles.person} />
            <span className={styles.placeholderText}>{about.photoPlaceholderText}</span>
          </div>
        )}
      </div>
      <div className={styles.text}>
        <p className={styles.eyebrow}>{about.eyebrow}</p>
        <h2 id="over-title" className={styles.heading}>
          {about.title}
        </h2>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
        <dl className={styles.facts}>
          {about.facts.map((fact) => (
            <div key={fact.label} className={fact.mobile ? undefined : styles.desktopOnly}>
              <dt className={styles.label}>{fact.label}</dt>
              <dd className={styles.value}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
