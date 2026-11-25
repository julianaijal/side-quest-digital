// Fetches AI crawler lists from two open sources and generates
// components/AiCrawlerPolicy/crawlers.ts with our normalized format.
//
//   npm run update:crawlers
//
// Primary:   https://github.com/ai-robots-txt/ai.robots.txt  (MIT)
// Secondary: https://github.com/monperrus/crawler-user-agents (MIT)

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PRIMARY_URL =
  'https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/main/robots.json';

const SECONDARY_URL =
  'https://raw.githubusercontent.com/monperrus/crawler-user-agents/master/crawler-user-agents.json';

const OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../components/AiCrawlerPolicy/crawlers.ts',
);

type Purpose = 'search' | 'training' | 'both';

const FUNCTION_MAP: Record<string, Purpose> = {
  'AI Search Crawlers': 'search',
  'AI Data Scrapers': 'training',
  'AI data scraper': 'training',
  'AI Data Providers': 'training',
  'AI Assistants': 'both',
  'AI Agents': 'both',
  'AI Coding Agents': 'training',
  'Undocumented AI Agents': 'training',
};

function toPurpose(fn: string): Purpose {
  return FUNCTION_MAP[fn] ?? 'training';
}

function stripMarkdown(s: string): string {
  const match = s.match(/^\[([^\]]+)\]/);
  return match ? match[1] : s.replace(/\[.*?\]\(.*?\)/g, '').trim();
}

function cleanOperator(raw: string): string {
  let s = stripMarkdown(raw);
  if (!s || s.toLowerCase().startsWith('unclear')) return '';
  s = s.replace(/\(.*$/, '').trim();
  const stop = s.search(/\bthat\b|\bwhich\b|\bwho\b|\bto\b/i);
  if (stop > 0) s = s.slice(0, stop).trim();
  s = s.replace(/^the\s+(Chinese|American|British|French|German|Japanese|Korean|Israeli)\s+company\s+/i, '');
  const comma = s.indexOf(',');
  if (comma > 0) s = s.slice(0, comma).trim();
  if (s.length > 40) s = s.split(/\s/).slice(0, 3).join(' ');
  return s.replace(/[,.]$/, '');
}

const DOMAIN_OPERATORS: Record<string, string> = {
  'developers.google.com': 'Google',
  'developer.amazon.com': 'Amazon',
  'docs.aws.amazon.com': 'Amazon',
  'azure.microsoft.com': 'Microsoft',
  'developers.facebook.com': 'Meta',
  'knownagents.com': '',
  'datadome.co': '',
  'github.com': '',
  'useragents.io': '',
  'stackoverflow.com': '',
};

const SUBDOMAIN_SKIP = new Set(['www', 'docs', 'api', 'help', 'support', 'crawl', 'crawl001', 'corp', 'bot', 'bots']);

function operatorFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host in DOMAIN_OPERATORS) return DOMAIN_OPERATORS[host];

    const parts = host.split('.');
    const meaningful = parts.find((p) => !SUBDOMAIN_SKIP.has(p.toLowerCase()) && p.length > 2);
    if (!meaningful) return '';

    return meaningful.charAt(0).toUpperCase() + meaningful.slice(1);
  } catch {
    return '';
  }
}

function operatorFromName(name: string): string {
  const cleaned = name
    .replace(/[-_]?(bot|spider|crawler|user|fetcher|searchbot|sitemapfetcher)$/i, '')
    .replace(/^(The\s+)/i, '')
    .trim();
  if (cleaned.length < 3) return '';
  return cleaned;
}

function cleanCuaName(pattern: string): string {
  let name = pattern
    .replace(/\[\\?[sS]\\?[sS]?\]\*/g, '')
    .replace(/\\[/\\]/g, '')
    .replace(/[\\/[\](){}^$.*+?|]/g, '')
    .trim();
  if (name.includes('com') && name.match(/[a-z]com$/)) {
    name = name.replace(/com$/, '').trim();
  }
  return name;
}

function isValidEntry(name: string, operator: string): boolean {
  if (name.length < 3 || name.length > 60) return false;
  if (/\s{2,}/.test(name)) return false;
  if (operator.length < 3) return false;
  return true;
}

type RobotsEntry = {
  operator: string;
  function: string;
  respect: string;
  frequency: string;
  description: string;
};

type CuaEntry = {
  pattern: string;
  url?: string;
  tags?: string[];
  instances?: string[];
};

function cuaPurpose(tags: string[]): Purpose {
  if (tags.includes('search-engine') && tags.includes('ai-crawler')) return 'both';
  if (tags.includes('search-engine')) return 'search';
  return 'training';
}

async function main() {
  const [primaryRes, secondaryRes] = await Promise.all([
    fetch(PRIMARY_URL),
    fetch(SECONDARY_URL),
  ]);

  if (!primaryRes.ok) {
    console.error(`Failed to fetch robots.json: ${primaryRes.status} ${primaryRes.statusText}`);
    process.exit(1);
  }

  const primaryData: Record<string, RobotsEntry> = await primaryRes.json();
  const entries: { name: string; operator: string; purpose: Purpose }[] = [];

  for (const [name, entry] of Object.entries(primaryData)) {
    if (name.startsWith('__')) continue;
    const operator = cleanOperator(entry.operator);
    if (!operator) continue;
    entries.push({ name, operator, purpose: toPurpose(entry.function) });
  }

  const primaryCount = entries.length;
  const knownNames = new Set(entries.map((e) => e.name.toLowerCase()));

  if (secondaryRes.ok) {
    const cuaData: CuaEntry[] = await secondaryRes.json();
    const aiCrawlers = cuaData.filter((e) => e.tags?.includes('ai-crawler'));
    let added = 0;

    for (const cua of aiCrawlers) {
      const name = cleanCuaName(cua.pattern);
      if (!name || name.length < 3) continue;
      if (knownNames.has(name.toLowerCase())) continue;

      try {
        const re = new RegExp(cua.pattern, 'i');
        if (entries.some((e) => re.test(e.name))) continue;
      } catch { /* pattern not a valid regex, skip match check */ }

      let operator = cua.url ? operatorFromUrl(cua.url) : '';
      if (!operator) operator = operatorFromName(name);
      if (!isValidEntry(name, operator)) continue;

      entries.push({
        name,
        operator,
        purpose: cuaPurpose(cua.tags ?? []),
      });
      knownNames.add(name.toLowerCase());
      added++;
    }

    console.log(`Secondary source: ${aiCrawlers.length} AI crawlers, ${added} new entries added`);
  } else {
    console.warn(`Failed to fetch crawler-user-agents: ${secondaryRes.status} (continuing with primary source only)`);
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const lines = entries.map(
    (e) => `  { name: '${e.name}', operator: '${e.operator}', purpose: '${e.purpose}' },`,
  );

  const output = `// Generated by scripts/update-crawlers.ts from two open sources (both MIT):
// - ai-robots-txt/ai.robots.txt (primary)
// - monperrus/crawler-user-agents (secondary, ai-crawler tagged entries)
// Do not edit by hand. Run: npm run update:crawlers

export type AiCrawler = {
  name: string;
  operator: string;
  purpose: 'search' | 'training' | 'both';
};

export const crawlers: AiCrawler[] = [
${lines.join('\n')}
];
`;

  writeFileSync(OUTPUT, output);
  console.log(`Wrote ${entries.length} crawlers (${primaryCount} primary + ${entries.length - primaryCount} secondary) to ${OUTPUT}`);

  const { crawlerDocs } = await import('../lib/crawler-docs.ts');
  const operators = new Set(entries.map((e) => e.operator));
  const stale = crawlerDocs
    .filter((d: { operator: string }) => !operators.has(d.operator))
    .map((d: { operator: string }) => d.operator);
  if (stale.length) {
    console.warn(`\nDoc entries with no matching crawlers: ${stale.join(', ')}`);
    console.warn('Check lib/crawler-docs.ts for outdated operator names.\n');
  }

  const multiBot = new Map<string, number>();
  for (const e of entries) multiBot.set(e.operator, (multiBot.get(e.operator) ?? 0) + 1);
  const documented = new Set(crawlerDocs.map((d: { operator: string }) => d.operator));
  const notable = [...multiBot.entries()]
    .filter(([op, count]) => count >= 3 && !documented.has(op))
    .map(([op, count]) => `${op} (${count} bots)`);
  if (notable.length) {
    console.warn(`\nNotable operators without docs entry: ${notable.join(', ')}`);
    console.warn('Consider adding them to lib/crawler-docs.ts.\n');
  }
}

main();
