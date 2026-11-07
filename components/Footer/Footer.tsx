import type { Site } from '@/content/site';
import { DiamondSolid } from '@/components/Icons/Icons';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import styles from './Footer.module.scss';

// The page is prerendered, so the year is the build year and updates on deploy.
export function Footer({ site }: { site: Site }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <DiamondSolid className={styles.diamond} />
          {site.name}, {site.city}
        </span>
        <span className={styles.meta}>
          <span>
            {site.footer.kvkLabel} {site.kvk}, © {year}
          </span>
          <CookieConsent {...site.cookies} />
        </span>
      </div>
    </footer>
  );
}
