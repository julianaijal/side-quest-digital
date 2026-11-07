import type { Metadata } from 'next';
import { site } from '@/content/site';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { Footer } from '@/components/Footer/Footer';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: site.notFound.metaTitle,
  robots: { index: false, follow: true },
};

// Rendered for every unknown URL, with a real 404 status.
export default function NotFound() {
  const { notFound } = site;
  return (
    <>
      <PageHeader site={site} label={notFound.homeLabel} />
      <main id="main" className={styles.main}>
        <h1 className={styles.title}>{notFound.title}</h1>
        <p className={styles.text}>{notFound.text}</p>
        <ButtonLink href="/">{notFound.homeLabel}</ButtonLink>
      </main>
      <Footer site={site} />
    </>
  );
}
