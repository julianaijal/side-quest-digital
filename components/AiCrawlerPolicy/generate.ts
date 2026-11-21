import type { AiCrawler } from './crawlers';

export type PolicySettings = {
  search: boolean;
  aiInput: boolean;
  aiTrain: boolean;
};

function shouldBlock(crawler: AiCrawler, settings: PolicySettings): boolean {
  if (!settings.search && !settings.aiTrain) return true;
  if (!settings.search && crawler.purpose === 'search') return true;
  if (!settings.aiTrain && crawler.purpose === 'training') return true;
  if (!settings.aiTrain && !settings.search && crawler.purpose === 'both') return true;
  if (!settings.aiTrain && crawler.purpose === 'both') return true;
  return false;
}

export function generateRobotsTxt(settings: PolicySettings, allCrawlers: AiCrawler[]): string {
  if (!settings.search && !settings.aiInput && !settings.aiTrain) {
    return 'User-agent: *\nDisallow: /';
  }

  const blocked = allCrawlers.filter((c) => shouldBlock(c, settings));
  if (blocked.length === 0) return '# No AI crawler blocks needed.';

  return blocked.map((c) => `User-agent: ${c.name}\nDisallow: /`).join('\n\n');
}

export function generateMetaTags(settings: PolicySettings): string {
  const parts: string[] = [];

  if (!settings.aiInput || !settings.aiTrain) {
    const directives: string[] = [];
    if (!settings.aiInput) directives.push('noai');
    if (!settings.aiTrain) directives.push('noimageai');
    parts.push(`<meta name="robots" content="${directives.join(', ')}">`);
  }

  const cs = `search=${settings.search ? 'yes' : 'no'}, ai-input=${settings.aiInput ? 'yes' : 'no'}, ai-train=${settings.aiTrain ? 'yes' : 'no'}`;
  parts.push(`<meta name="content-signals" content="${cs}">`);

  return parts.join('\n');
}

export function generateHttpHeaders(settings: PolicySettings): string {
  const lines: string[] = [];

  if (!settings.aiInput || !settings.aiTrain) {
    const directives: string[] = [];
    if (!settings.aiInput) directives.push('noai');
    if (!settings.aiTrain) directives.push('noimageai');
    lines.push(`X-Robots-Tag: ${directives.join(', ')}`);
  }

  const cs = `search=${settings.search ? 'yes' : 'no'}, ai-input=${settings.aiInput ? 'yes' : 'no'}, ai-train=${settings.aiTrain ? 'yes' : 'no'}`;
  lines.push(`Content-Signals: ${cs}`);

  return lines.join('\n');
}

export function generateContentSignals(settings: PolicySettings): string {
  return `search=${settings.search ? 'yes' : 'no'}, ai-input=${settings.aiInput ? 'yes' : 'no'}, ai-train=${settings.aiTrain ? 'yes' : 'no'}`;
}
