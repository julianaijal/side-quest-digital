import type { Site } from '@/content/site';
import styles from '../Services.module.scss';

export function DashboardSnippet({ snippets }: { snippets: Site['snippets'] }) {
  const [organic, conversions] = snippets.dashboardLegend;
  return (
    <figure aria-label={snippets.dashboardAriaLabel} className={`${styles.snippet} ${styles.dashboard}`}>
      <div className={styles.dashboardHead}>
        <span className={styles.strong}>
          <span className={styles.onlyDesktop}>{snippets.dashboardLabel}</span>
          <span className={styles.onlyMobile}>{snippets.dashboardLabelMobile}</span>
        </span>
        <span className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchOrganic}`} aria-hidden="true" />
            {organic}
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchConversions}`} aria-hidden="true" />
            {conversions}
          </span>
        </span>
      </div>
      <svg viewBox="0 0 320 110" width="320" height="110" className={styles.chart} aria-hidden="true">
        <path d="M0 100 H320" stroke="var(--theme-border)" />
        <path d="M0 60 H320" stroke="var(--theme-border)" strokeDasharray="2 4" />
        <path
          d="M0 84 C 30 80, 50 74, 80 70 S 130 66, 160 52 S 220 40, 250 34 S 300 20, 320 16 L320 100 L0 100 Z"
          fill="var(--theme-chart-area)"
        />
        <path
          d="M0 84 C 30 80, 50 74, 80 70 S 130 66, 160 52 S 220 40, 250 34 S 300 20, 320 16"
          fill="none"
          stroke="var(--theme-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0 94 C 40 92, 70 90, 110 86 S 180 80, 220 72 S 290 62, 320 56"
          fill="none"
          stroke="var(--theme-action)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />
      </svg>
    </figure>
  );
}
