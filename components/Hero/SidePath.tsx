import styles from './Hero.module.scss';

// The side path motif, the one memorable element on the page: a full width
// main road with a dotted mint path that leaves it, rises to a sand diamond on
// a dark halo and rejoins the road. Paths match the Night Reef design files.
// A duplicate path in the page colour covers the dotted path and is animated
// away to "draw" it (see Hero.module.scss).

const variants = {
  desktop: {
    viewBox: '0 0 1440 260',
    road: 'M0 220 H1440',
    path: 'M760 220 C 880 220, 880 70, 1040 70 C 1200 70, 1200 220, 1320 220',
    dash: '0.5 11',
    start: { cx: 760, cy: 220, r: 7 },
    end: { cx: 1320, cy: 220, r: 7 },
    halo: { cx: 1040, cy: 70, r: 40 },
    diamond: 'M1040 44 L1066 70 L1040 96 L1014 70 Z',
  },
  mobile: {
    viewBox: '0 0 390 150',
    road: 'M0 128 H390',
    path: 'M90 128 C 150 128, 150 40, 210 40 C 270 40, 270 128, 330 128',
    dash: '0.5 10',
    start: { cx: 90, cy: 128, r: 6 },
    end: { cx: 330, cy: 128, r: 6 },
    halo: { cx: 210, cy: 40, r: 28 },
    diamond: 'M210 22 L228 40 L210 58 L192 40 Z',
  },
} as const;

export function SidePath({ variant }: { variant: keyof typeof variants }) {
  const v = variants[variant];
  return (
    <svg viewBox={v.viewBox} className={styles.svg} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={v.road} stroke="var(--theme-border-strong)" strokeWidth="2" />
      <path
        d={v.path}
        fill="none"
        stroke="var(--theme-accent)"
        strokeWidth="3"
        strokeDasharray={v.dash}
        strokeLinecap="round"
      />
      <path
        className={styles.cover}
        d={v.path}
        pathLength={1}
        fill="none"
        stroke="var(--theme-bg)"
        strokeWidth="10"
        strokeDasharray="1 1"
      />
      <circle
        cx={v.start.cx}
        cy={v.start.cy}
        r={v.start.r}
        fill="var(--theme-bg)"
        stroke="var(--theme-accent)"
        strokeWidth="2.5"
      />
      <circle cx={v.end.cx} cy={v.end.cy} r={v.end.r} fill="var(--theme-accent)" />
      <g className={styles.pop}>
        <circle cx={v.halo.cx} cy={v.halo.cy} r={v.halo.r} fill="var(--theme-halo)" />
        <path d={v.diamond} fill="var(--theme-action)" />
      </g>
    </svg>
  );
}
