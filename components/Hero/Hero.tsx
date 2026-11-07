import type { Site } from '@/content/site';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { Diamond } from '@/components/Icons/Icons';
import { SidePath } from './SidePath';
import styles from './Hero.module.scss';

export function Hero({ site }: { site: Site }) {
  const { hero } = site;
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.badge}>
            <Diamond className={styles.diamond} />
            <span className={styles.badgeDesktop}>{hero.eyebrow}</span>
            <span className={styles.badgeMobile}>{hero.eyebrowMobile}</span>
          </p>
          <h1 className={styles.title}>{hero.title}</h1>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={site.navCta.href} className={styles.primary} track="cta_click" trackLocation="hero">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink
              href="#services"
              variant="secondary"
              className={styles.secondary}
              track="cta_click"
              trackLocation="hero_services"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </div>
      <div className={styles.pathDesktop}>
        <SidePath variant="desktop" />
      </div>
      <div className={styles.pathMobile}>
        <SidePath variant="mobile" />
      </div>
    </section>
  );
}
