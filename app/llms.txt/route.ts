import { site } from '@/content/site';
import { absoluteUrl, isPlaceholder } from '@/lib/seo';

export const dynamic = 'force-static';

// Plain text summary for AI assistants and crawlers (llmstxt.org).
// Built from the same content file as the page, so the two never drift.
export function GET() {
  const { llms } = site;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.meta.description}`,
    '',
    llms.intro,
    '',
    `## ${llms.servicesTitle}`,
    '',
    ...site.services.items.map((service) => `- ${service.title}: ${service.text}`),
    '',
    `## ${llms.contactTitle}`,
    '',
    `- ${llms.websiteLabel}: ${absoluteUrl('/')}`,
    ...(isPlaceholder(site.email) ? [] : [`- ${llms.mailLabel}: ${site.email}`]),
    ...(isPlaceholder(site.linkedin) ? [] : [`- ${llms.linkedinLabel}: ${site.linkedin}`]),
    `- ${llms.locationLabel}: ${site.city}, ${site.country}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
