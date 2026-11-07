// Checks a running copy of the site against the technical rules in AGENTS.md:
// document basics, headings, accessibility hooks, response headers and the
// files crawlers and browsers look for.
//
//   node scripts/check-site.ts http://localhost:3000
//   node scripts/check-site.ts https://side-quest-digital.com --live
//
// --live adds checks that only make sense on the real domain (HSTS, HTTPS
// redirect, hashed asset caching on Cloudflare). Exits 1 on any failure and
// prints a Markdown report, so CI can paste it into an issue.

const args = process.argv.slice(2);
const base = (args.find((arg) => !arg.startsWith('--')) ?? 'http://localhost:3000').replace(/\/$/, '');
const live = args.includes('--live');

type Result = { page: string; rule: string; ok: boolean; detail?: string };
const results: Result[] = [];

function check(page: string, rule: string, ok: boolean, detail?: string) {
  results.push({ page, rule, ok, detail: ok ? undefined : detail });
}

async function get(path: string, init?: RequestInit) {
  const response = await fetch(base + path, { redirect: 'manual', ...init });
  const body = await response.text();
  return { response, body };
}

function all(html: string, pattern: RegExp) {
  return [...html.matchAll(pattern)];
}

function checkHtml(page: string, html: string) {
  check(page, 'doctype is the first line', /^<!doctype html>/i.test(html.trimStart()));
  check(page, 'html has a lang attribute', /<html[^>]*\slang="[a-z]{2}(-[A-Za-z]{2})?"/i.test(html));
  check(page, 'UTF-8 charset in the first 1024 bytes', /<meta charset="utf-8"/i.test(html.slice(0, 1024)));

  const viewport = html.match(/<meta name="viewport" content="([^"]*)"/i)?.[1] ?? '';
  check(page, 'viewport uses device width', viewport.includes('width=device-width'), viewport);
  check(
    page,
    'viewport allows zooming',
    !/user-scalable=(no|0)|maximum-scale=1(\.0)?\b/i.test(viewport),
    viewport,
  );

  const titles = all(html, /<title>([^<]*)<\/title>/gi);
  check(page, 'exactly one non empty title', titles.length === 1 && titles[0][1].trim() !== '', `${titles.length} found`);
  check(page, 'meta description', /<meta name="description" content="[^"]+"/i.test(html));
  check(page, 'meta robots', /<meta name="robots" content="[^"]+"/i.test(html));

  const h1s = all(html, /<h1[\s>]/gi).length;
  check(page, 'exactly one h1', h1s === 1, `${h1s} found`);
  const levels = all(html, /<h([1-6])[\s>]/gi).map((match) => Number(match[1]));
  const skipped = levels.find((level, index) => index > 0 && level > levels[index - 1] + 1);
  check(page, 'no skipped heading levels', skipped === undefined, `jump to h${skipped}`);

  const bodyStart = html.slice(html.search(/<body[\s>]/i));
  const firstFocusable = bodyStart.match(/<(a|button|input|select|textarea)\b[^>]*>/i)?.[0] ?? '';
  check(page, 'skip link is the first focusable element', /href="#main"/.test(firstFocusable), firstFocusable);
  check(page, 'main landmark with id main', /<main[^>]*\sid="main"/.test(html));

  check(page, 'scroll padding clears the sticky nav', /scroll-padding-top:/.test(html));
  check(page, 'styles for forced colors mode', /forced-colors:\s*active/.test(html));
  check(page, 'stable scrollbar gutter', /scrollbar-gutter:stable/.test(html.replace(/\s/g, '')));

  const imgsWithoutAlt = all(html, /<img\b[^>]*>/gi).filter((match) => !/\salt=/.test(match[0]));
  check(page, 'every img has alt', imgsWithoutAlt.length === 0, `${imgsWithoutAlt.length} without alt`);

  const emptyLinks = all(html, /<a\b([^>]*)>\s*<\/a>/gi).filter((match) => !/aria-label=/.test(match[1]));
  check(page, 'no empty links', emptyLinks.length === 0, `${emptyLinks.length} empty`);
}

function checkHeaders(page: string, headers: Headers) {
  const csp = headers.get('content-security-policy') ?? '';
  check(page, 'X-Content-Type-Options nosniff', headers.get('x-content-type-options') === 'nosniff');
  check(page, 'CSP frame-ancestors', /frame-ancestors 'none'/.test(csp), csp || 'no CSP');
  check(page, 'CSP object-src none', /object-src 'none'/.test(csp));
  check(page, 'Referrer-Policy', headers.has('referrer-policy'));
  check(page, 'Permissions-Policy', headers.has('permissions-policy'));
  check(page, 'no x-powered-by', !headers.has('x-powered-by'), headers.get('x-powered-by') ?? '');
  const hsts = headers.get('strict-transport-security') ?? '';
  check(page, 'HSTS with includeSubDomains', /max-age=\d{8,}.*includeSubDomains/i.test(hsts), hsts || 'missing');
  const cache = headers.get('cache-control') ?? '';
  check(page, 'HTML revalidates', /max-age=0|no-cache/.test(cache), cache || 'missing');
}

// The JSON-LD parses, describes the site, business and person, and every
// image it names is actually served.
async function checkJsonLd() {
  const { body } = await get('/');
  const blocks = all(body, /<script type="application\/ld\+json">([^<]*)<\/script>/g);
  check('/', 'one JSON-LD block', blocks.length === 1, `${blocks.length} found`);
  if (blocks.length !== 1) return;

  let graph: Array<Record<string, unknown>> = [];
  try {
    graph = JSON.parse(blocks[0][1])['@graph'] ?? [];
  } catch (error) {
    check('/', 'JSON-LD parses', false, String(error));
    return;
  }
  const types = graph.map((node) => node['@type']);
  for (const type of ['WebSite', 'ProfessionalService', 'Person']) {
    check('/', `JSON-LD has a ${type}`, types.includes(type), types.join(', '));
  }

  const images = blocks[0][1].match(/"@type":"ImageObject","url":"[^"]+"/g) ?? [];
  for (const image of images) {
    const path = new URL(image.split('"url":"')[1].slice(0, -1)).pathname;
    const response = await fetch(base + path, { method: 'HEAD' });
    check('/', `JSON-LD image ${path} is served`, response.ok, String(response.status));
  }
}

async function main() {
  for (const page of ['/', '/privacy']) {
    const { response, body } = await get(page);
    check(page, 'status 200', response.status === 200, String(response.status));
    checkHtml(page, body);
    checkHeaders(page, response.headers);
  }

  await checkJsonLd();

  const missing = await get('/this-page-does-not-exist');
  check('404', 'unknown URL returns 404', missing.response.status === 404, String(missing.response.status));
  check('404', 'styled 404 page', missing.body.includes('id="main"'));

  const robots = await get('/robots.txt');
  check('/robots.txt', 'served', robots.response.status === 200);
  check('/robots.txt', 'links the sitemap', /^Sitemap: https:\/\//m.test(robots.body));
  check('/robots.txt', 'names AI crawlers', /User-Agent: GPTBot/i.test(robots.body));

  const sitemap = await get('/sitemap.xml');
  check('/sitemap.xml', 'served', sitemap.response.status === 200 && sitemap.body.includes('<urlset'));

  const llms = await get('/llms.txt');
  check('/llms.txt', 'served', llms.response.status === 200 && llms.body.startsWith('# '));

  const markdown = await get('/index.md');
  check(
    '/index.md',
    'served as Markdown',
    markdown.response.status === 200 &&
      (markdown.response.headers.get('content-type') ?? '').startsWith('text/markdown') &&
      markdown.body.startsWith('# '),
  );
  check('/index.md', 'canonical points to the page', /rel="canonical"/.test(markdown.response.headers.get('link') ?? ''));

  const manifest = await get('/manifest.webmanifest');
  check(
    '/manifest.webmanifest',
    'has a maskable icon',
    manifest.response.status === 200 && manifest.body.includes('"maskable"'),
  );

  const security = await get('/.well-known/security.txt');
  const expires = Date.parse(security.body.match(/^Expires: (.+)$/m)?.[1] ?? '');
  check('/.well-known/security.txt', 'served with Contact', /^Contact: /m.test(security.body));
  const daysLeft = Math.floor((expires - Date.now()) / 86_400_000);
  check('/.well-known/security.txt', 'Expires more than 30 days ahead', daysLeft > 30, `${daysLeft} days left, deploy to renew`);

  if (live) {
    const url = new URL(base);
    const http = await fetch(`http://${url.host}/`, { redirect: 'manual' });
    check('http', 'HTTP redirects to HTTPS', [301, 308].includes(http.status) && (http.headers.get('location') ?? '').startsWith('https://'), String(http.status));

    const { body } = await get('/');
    const asset = body.match(/\/_next\/static\/[^"]+\.js/)?.[0];
    if (asset) {
      const response = await fetch(base + asset);
      const cache = response.headers.get('cache-control') ?? '';
      check('assets', 'hashed assets immutable for a year', /max-age=31536000.*immutable/.test(cache), cache);
    }
  }

  const failed = results.filter((result) => !result.ok);
  console.log(`## Site check for ${base}\n`);
  console.log(`${results.length - failed.length} of ${results.length} checks pass.\n`);
  for (const result of failed) {
    console.log(`- [ ] \`${result.page}\` ${result.rule}${result.detail ? `: ${result.detail}` : ''}`);
  }
  process.exit(failed.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
