export type ResolverInput = {
  robotsTxt: string;
  url: string;
  metaRobots: string;
  xRobotsTag: string;
  userAgent: string;
};

export type Directive = {
  source: string;
  directive: string;
  value: string;
};

export type ResolverResult = {
  canCrawl: boolean;
  canIndex: boolean;
  canFollow: boolean;
  conflicts: string[];
  directives: Directive[];
};

type RobotsRule = { path: string; allow: boolean };
type RobotsGroup = { agents: string[]; rules: RobotsRule[] };

function parseRobotsTxtGroups(txt: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;

  for (const raw of txt.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const field = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (field === 'user-agent') {
      if (current && current.rules.length > 0) {
        groups.push(current);
        current = null;
      }
      if (!current) current = { agents: [], rules: [] };
      current.agents.push(value.toLowerCase());
    } else if (field === 'allow' && current) {
      current.rules.push({ path: value, allow: true });
    } else if (field === 'disallow' && current) {
      if (value) current.rules.push({ path: value, allow: false });
    }
  }
  if (current && current.rules.length > 0) groups.push(current);
  return groups;
}

function matchesPath(rulePath: string, url: string): boolean {
  let pattern = rulePath;
  let anchored = false;
  if (pattern.endsWith('$')) {
    anchored = true;
    pattern = pattern.slice(0, -1);
  }
  if (pattern.includes('*')) {
    const re = new RegExp(
      '^' + pattern.split('*').map(escapeRegExp).join('.*') + (anchored ? '$' : ''),
    );
    return re.test(url);
  }
  if (anchored) return url === pattern;
  return url.startsWith(pattern);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkRobotsTxt(
  groups: RobotsGroup[],
  url: string,
  userAgent: string,
): boolean {
  const ua = userAgent.toLowerCase();
  const specific = groups.find((g) => g.agents.some((a) => a === ua));
  const wildcard = groups.find((g) => g.agents.includes('*'));
  const group = specific ?? wildcard;
  if (!group) return true;

  let bestMatch: RobotsRule | null = null;
  let bestLen = -1;

  for (const rule of group.rules) {
    if (matchesPath(rule.path, url) && rule.path.length > bestLen) {
      bestLen = rule.path.length;
      bestMatch = rule;
    }
  }

  return bestMatch ? bestMatch.allow : true;
}

function parseDirectives(input: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!input.trim()) return map;
  for (const part of input.split(',')) {
    const d = part.trim().toLowerCase();
    if (d === 'none') {
      map.set('noindex', 'noindex');
      map.set('nofollow', 'nofollow');
    } else if (d === 'all') {
      map.set('index', 'index');
      map.set('follow', 'follow');
    } else if (d) {
      map.set(d, d);
    }
  }
  return map;
}

function parseXRobotsTag(value: string, userAgent: string): Map<string, string> {
  if (!value.trim()) return new Map();
  const ua = userAgent.toLowerCase();
  const colonIdx = value.indexOf(':');
  if (colonIdx !== -1) {
    const beforeColon = value.slice(0, colonIdx).trim().toLowerCase();
    const afterColon = value.slice(colonIdx + 1).trim();
    if (!beforeColon.includes(',') && !['noindex', 'nofollow', 'none', 'all', 'noarchive', 'nosnippet', 'index', 'follow'].includes(beforeColon)) {
      if (beforeColon === ua) return parseDirectives(afterColon);
      return new Map();
    }
  }
  return parseDirectives(value);
}

export function resolvePolicy(input: ResolverInput): ResolverResult {
  const groups = parseRobotsTxtGroups(input.robotsTxt);
  const canCrawl = checkRobotsTxt(groups, input.url, input.userAgent);

  const metaDirs = parseDirectives(input.metaRobots);
  const xDirs = parseXRobotsTag(input.xRobotsTag, input.userAgent);

  const hasNoindexMeta = metaDirs.has('noindex');
  const hasNoindexX = xDirs.has('noindex');
  const canIndex = !hasNoindexMeta && !hasNoindexX;

  const hasNofollowMeta = metaDirs.has('nofollow');
  const hasNofollowX = xDirs.has('nofollow');
  const canFollow = !hasNofollowMeta && !hasNofollowX;

  const conflicts: string[] = [];
  const directives: Directive[] = [];

  if (!canCrawl) {
    directives.push({ source: 'robots.txt', directive: 'Disallow', value: 'Crawling blocked' });
    if (hasNoindexMeta || hasNoindexX) {
      conflicts.push(
        'The robots.txt blocks crawling, so the noindex directive will never be seen by the crawler. The page may still appear in search results without a snippet.',
      );
    } else {
      conflicts.push(
        'The robots.txt blocks crawling. The page may still appear in search results without a snippet if other pages link to it.',
      );
    }
  }

  for (const [key, val] of metaDirs) {
    directives.push({ source: 'meta robots', directive: key, value: val });
  }
  for (const [key, val] of xDirs) {
    directives.push({ source: 'X-Robots-Tag', directive: key, value: val });
  }

  if (hasNoindexMeta !== hasNoindexX && (hasNoindexMeta || hasNoindexX)) {
    if (metaDirs.has('index') && hasNoindexX) {
      conflicts.push(
        'Meta robots says "index" but X-Robots-Tag says "noindex". The most restrictive directive wins: the page will not be indexed.',
      );
    }
  }

  return { canCrawl, canIndex, canFollow, conflicts, directives };
}
