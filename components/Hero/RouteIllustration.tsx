import styles from './Hero.module.scss';

// The side path motif: a grey main road, a dotted green path that leaves it,
// rises to a diamond marker and rejoins the road. Paths match the design files.
// A duplicate path in the panel colour covers the dotted path and is animated
// away to "draw" it (see Hero.module.scss).

const variants = {
  desktop: {
    viewBox: '0 0 480 300',
    road: 'M16 236 H464',
    roadWidth: 2,
    path: 'M84 236 C 150 236, 140 92, 240 92 C 340 92, 330 236, 396 236',
    pathWidth: 3,
    dash: '0.5 10',
    coverWidth: 9,
    start: { cx: 84, cy: 236, r: 7, w: 2.5 },
    end: { cx: 396, cy: 236, r: 7 },
    halo: { cx: 240, cy: 92, r: 34 },
    diamond: 'M240 68 L264 92 L240 116 L216 92 Z',
    diamondWidth: 2,
  },
  mobile: {
    viewBox: '0 0 480 200',
    road: 'M16 170 H464',
    roadWidth: 3,
    path: 'M84 170 C 150 170, 140 46, 240 46 C 340 46, 330 170, 396 170',
    pathWidth: 4,
    dash: '0.5 12',
    coverWidth: 11,
    start: { cx: 84, cy: 170, r: 9, w: 3 },
    end: { cx: 396, cy: 170, r: 9 },
    halo: { cx: 240, cy: 46, r: 40 },
    diamond: 'M240 18 L268 46 L240 74 L212 46 Z',
    diamondWidth: 3,
  },
} as const;

export function RouteIllustration({ variant }: { variant: keyof typeof variants }) {
  const v = variants[variant];
  const [, , w, h] = v.viewBox.split(' ');
  return (
    <svg viewBox={v.viewBox} width={w} height={h} className={styles.svg} aria-hidden="true">
      <path d={v.road} stroke="#C9C6BB" strokeWidth={v.roadWidth} strokeLinecap="round" />
      <path
        d={v.path}
        fill="none"
        stroke="#1E5A45"
        strokeWidth={v.pathWidth}
        strokeDasharray={v.dash}
        strokeLinecap="round"
      />
      <path
        className={styles.cover}
        d={v.path}
        pathLength={1}
        fill="none"
        stroke="#EEF5F1"
        strokeWidth={v.coverWidth}
        strokeDasharray="1 1"
      />
      <circle cx={v.start.cx} cy={v.start.cy} r={v.start.r} fill="#EEF5F1" stroke="#1E5A45" strokeWidth={v.start.w} />
      <circle cx={v.end.cx} cy={v.end.cy} r={v.end.r} fill="#1E5A45" />
      <g className={styles.pop}>
        <circle cx={v.halo.cx} cy={v.halo.cy} r={v.halo.r} fill="#DDF1E6" />
        <path d={v.diamond} fill="#7DD3BE" stroke="#1E5A45" strokeWidth={v.diamondWidth} strokeLinejoin="round" />
      </g>
    </svg>
  );
}
