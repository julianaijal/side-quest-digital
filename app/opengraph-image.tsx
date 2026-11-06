import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const alt = site.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Colors from styles/_tokens.scss. ImageResponse cannot read SCSS.
const paper = '#F6F5F0';
const ink = '#13201B';
const green = '#1E5A45';
const mint = '#7DD3BE';
const lineStrong = '#C9C6BB';

const interSemiBold = await readFile(join(process.cwd(), 'assets/fonts/Inter-SemiBold.ttf'));

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px 88px',
          background: paper,
          color: ink,
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 28 28">
            <path d="M2 22 H26" stroke={lineStrong} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M6 22 C 9 22, 9 10, 14 10 C 19 10, 19 22, 22 22"
              fill="none"
              stroke={green}
              strokeWidth="2"
              strokeDasharray="0.5 4"
              strokeLinecap="round"
            />
            <path d="M14 3 L17.5 6.5 L14 10 L10.5 6.5 Z" fill={mint} stroke={green} strokeWidth="1.25" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 34, letterSpacing: '-0.01em' }}>{site.name}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span style={{ fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color: green }}>
            {site.hero.eyebrow}
          </span>
          <span style={{ fontSize: 68, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 1000 }}>
            {site.hero.title}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Inter', data: interSemiBold, style: 'normal', weight: 600 }],
    },
  );
}
