import { generateOgImage, ogSize, ogContentType } from '@/lib/og';
import { site } from '@/content/site';

const tool = site.tools.items.find((t) => t.slug === 'crawl-policy-resolver')!;

export const alt = `${tool.title} · ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOgImage(tool.title, tool.description);
}
