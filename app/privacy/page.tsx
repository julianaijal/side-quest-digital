import type { Metadata } from 'next';
import Link from 'next/link';
import { getSite } from '@/content/getSite';
import { site as content } from '@/content/site';
import { LogoMark } from '@/components/Icons/Icons';
import { Footer } from '@/components/Footer/Footer';
import styles from './privacy.module.scss';

export const metadata: Metadata = {
  title: content.privacy.metaTitle,
  description: content.privacy.metaDescription,
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

export default async function Privacy() {
  const site = await getSite();
  const { privacy } = site;
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label={privacy.backLabel}>
          <LogoMark className={styles.mark} />
          <span>{site.name}</span>
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{privacy.title}</h1>
        <p className={styles.updated}>{privacy.updated}</p>
        {privacy.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.heading}>{section.title}</h2>
            {section.paragraphs.map((text) => (
              <p key={text} className={styles.text}>
                {text}
              </p>
            ))}
          </section>
        ))}
        <p className={styles.back}>
          <Link href="/">{privacy.backLabel}</Link>
        </p>
      </main>
      <Footer site={site} />
    </>
  );
}
