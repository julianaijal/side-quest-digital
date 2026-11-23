import { generateOgImage, ogSize, ogContentType } from '@/lib/og';
import { site } from '@/content/site';

export const alt = site.privacy.metaTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage(site.privacy.title, site.name);
}
