import { absoluteUrl, contentSignal } from '@/lib/seo';

export const dynamic = 'force-static';

// All crawlers are welcome. AI crawlers are named explicitly, so the policy
// for them is a deliberate choice and not a side effect of the wildcard.
// A plain route instead of app/robots.ts, which cannot write Content-Signal.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export function GET() {
  const lines = [
    'User-Agent: *',
    `Content-Signal: ${contentSignal}`,
    'Allow: /',
    '',
    ...AI_CRAWLERS.map((crawler) => `User-Agent: ${crawler}`),
    `Content-Signal: ${contentSignal}`,
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
