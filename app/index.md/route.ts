import { site } from '@/content/site';
import { absoluteUrl, isPlaceholder, obfuscatedEmail } from '@/lib/seo';

export const dynamic = 'force-static';

// The homepage as Markdown, for agents that read text rather than HTML.
// Built from the same content file as the page, so the two never drift.
// The canonical Link header points search engines back to the HTML page.
export function GET() {
  const { hero, services, about, contact, llms } = site;
  const lines = [
    `# ${hero.title}`,
    '',
    hero.lead,
    '',
    `## ${services.title}`,
    '',
    ...services.items.flatMap((service) => [`### ${service.title}`, '', service.text, '']),
    `## ${about.title}`,
    '',
    ...about.paragraphs.flatMap((paragraph) => [paragraph, '']),
    ...about.facts.map((fact) => `- ${fact.label}: ${fact.value}`),
    '',
    `## ${contact.title}`,
    '',
    contact.text,
    '',
    `- ${llms.mailLabel}: ${obfuscatedEmail()}`,
    ...(isPlaceholder(site.linkedin) ? [] : [`- ${llms.linkedinLabel}: ${site.linkedin}`]),
    `- ${llms.locationLabel}: ${site.city}, ${site.country}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Link: `<${absoluteUrl('/')}>; rel="canonical"`,
    },
  });
}
