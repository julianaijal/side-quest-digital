import { site, type Site } from './site';

// Single entry point for page content. Today it returns the local content
// file; later this is the one place to swap in a headless CMS (see ROADMAP.md).
export async function getSite(): Promise<Site> {
  return site;
}
