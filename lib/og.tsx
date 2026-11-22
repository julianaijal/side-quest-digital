import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/content/site';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const interRegular = readFile(join(process.cwd(), 'assets/fonts/Inter-Regular.ttf'));
const interSemiBold = readFile(join(process.cwd(), 'assets/fonts/Inter-SemiBold.ttf'));

const BG = '#0E1A18';
const SURFACE = '#1A2B27';
const TEXT = '#E6ECE8';
const MUTED = '#9DB0A8';
const MINT = '#8CCFB2';
const SAND = '#E9B96E';

export async function generateOgImage(title: string, subtitle?: string) {
  const [regular, semiBold] = await Promise.all([interRegular, interSemiBold]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: BG,
          padding: '60px 80px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Quest marker icon */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="18" y="2" width="22" height="22" rx="4" transform="rotate(45 18 2)" fill={MINT} stroke={MINT} strokeWidth="2" />
            <rect x="18" y="8" width="14" height="14" rx="2" transform="rotate(45 18 8)" fill={BG} />
            <rect x="18" y="12" width="8" height="8" rx="1" transform="rotate(45 18 12)" fill={SAND} />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 600, color: TEXT }}>
            {site.name}
          </span>
        </div>

        {/* Title area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {subtitle && (
            <span style={{ fontSize: 24, color: MUTED }}>
              {subtitle}
            </span>
          )}
          <span
            style={{
              fontSize: title.length > 40 ? 56 : 72,
              fontWeight: 600,
              color: TEXT,
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        </div>

        {/* Footer line */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '3px',
            backgroundColor: SURFACE,
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '3px',
              backgroundColor: MINT,
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
        { name: 'Inter', data: semiBold, weight: 600 as const, style: 'normal' as const },
      ],
    },
  );
}
