import Link from 'next/link';
import type { Site } from '@/content/site';
import { LogoMark } from '@/components/Icons/Icons';
import styles from './PageHeader.module.scss';

/** Header for pages other than the homepage: the logo links back home. */
export function PageHeader({ site, label }: { site: Site; label: string }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label={label}>
        <LogoMark className={styles.mark} />
        <span>{site.name}</span>
      </Link>
    </header>
  );
}
