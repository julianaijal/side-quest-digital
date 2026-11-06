import { cacheLife } from 'next/cache';
import type { Site } from '@/content/site';
import { DiamondSolid } from '@/components/Icons/Icons';
import styles from './Footer.module.scss';

// Cached so the page stays static; the year refreshes once a day.
async function currentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export async function Footer({ site }: { site: Site }) {
  const year = await currentYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <DiamondSolid className={styles.diamond} />
          {site.name}
        </span>
        <span>
          {site.footer.kvkLabel} {site.kvk} · {site.city} · © {year}
        </span>
      </div>
    </footer>
  );
}
