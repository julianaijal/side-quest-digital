import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Same mark as app/icon.svg, on a full bleed paper background (iOS rounds it).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F5F0' }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M16 4.5 L27.5 16 L16 27.5 L4.5 16 Z" fill="#7DD3BE" stroke="#1E5A45" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
