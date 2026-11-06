import type { Site } from '@/content/site';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { Diamond } from '@/components/Icons/Icons';
import { RouteIllustration } from './RouteIllustration';
import styles from './Hero.module.scss';

export function Hero({ site }: { site: Site }) {
  const { hero } = site;
  return (
    <section id="top" className={styles.hero}>
      <div className={`${styles.art} ${styles.artMobile}`}>
        <RouteIllustration variant="mobile" />
      </div>
      <div className={styles.text}>
        <p className={styles.eyebrow}>
          <Diamond className={styles.diamond} />
          <span className={styles.eyebrowDesktop}>{hero.eyebrow}</span>
          <span className={styles.eyebrowMobile}>{hero.eyebrowMobile}</span>
        </p>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.lead}>{hero.lead}</p>
        <div className={styles.actions}>
          <ButtonLink href={`mailto:${site.email}`} className={styles.primary}>
            {hero.primaryCta}
          </ButtonLink>
          <ButtonLink href="#diensten" variant="secondary" className={styles.secondary}>
            {hero.secondaryCta}
          </ButtonLink>
        </div>
      </div>
      <div className={`${styles.art} ${styles.artDesktop}`}>
        <RouteIllustration variant="desktop" />
      </div>
    </section>
  );
}
