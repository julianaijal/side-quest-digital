import { generateOgImage, ogSize, ogContentType } from '@/lib/og';
import { site } from '@/content/site';

export const alt = site.meta.title;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage(
    site.hero.title,
    site.hero.eyebrow,
  );
}
