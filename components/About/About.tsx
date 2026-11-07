import Image from 'next/image';
import type { Site } from '@/content/site';
import styles from './About.module.scss';

export function About({ site }: { site: Site }) {
  const { about } = site;
  return (
    <section
      id="about"
      className={`${styles.section} ${about.photo ? '' : styles.noPhoto}`}
      aria-labelledby="about-title"
    >
      {about.photo && (
        <div className={styles.photo}>
          <Image
            src={about.photo}
            alt={about.photoAlt}
            fill
            sizes="(max-width: 640px) 100vw, 380px"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.text}>
        <div className={styles.intro}>
          <h2 id="about-title" className={styles.heading}>
            {about.title}
          </h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
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
