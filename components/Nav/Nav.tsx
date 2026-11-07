import type { Site } from '@/content/site';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { LogoMark } from '@/components/Icons/Icons';
import { MobileMenu } from './MobileMenu';
import styles from './Nav.module.scss';

export function Nav({ site }: { site: Site }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} aria-label={site.homeLabel}>
          <LogoMark className={styles.mark} />
          <span className={styles.wordmark}>{site.name}</span>
        </a>
        <nav aria-label={site.navLabel} className={styles.desktop}>
          {site.nav.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
          <ButtonLink href={site.navCta.href} size="small">
            {site.navCta.label}
          </ButtonLink>
        </nav>
        <MobileMenu
          links={site.nav}
          cta={site.navCta}
          openLabel={site.menuOpenLabel}
          closeLabel={site.menuCloseLabel}
          navLabel={site.navLabel}
        />
      </div>
    </header>
  );
}
