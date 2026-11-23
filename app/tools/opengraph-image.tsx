import { generateOgImage, ogSize, ogContentType } from '@/lib/og';
import { site } from '@/content/site';

export const alt = site.tools.meta.title;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage(
    site.tools.title,
    site.tools.intro,
  );
}
