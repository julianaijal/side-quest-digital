import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePolicy } from '../components/CrawlPolicyResolver/parse.ts';

test('robots.txt disallow blocks crawling', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /',
    url: '/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, false);
});

test('noindex in meta robots blocks indexing', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: 'noindex, follow',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canIndex, false);
  assert.equal(result.canFollow, true);
});

test('robots.txt block + meta noindex produces conflict warning', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /',
    url: '/page',
    metaRobots: 'noindex',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.ok(result.conflicts.length > 0);
  assert.ok(result.conflicts[0].includes('never be seen'));
});

test('empty input returns open policy with no conflicts', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, true);
  assert.equal(result.canIndex, true);
  assert.equal(result.conflicts.length, 0);
});

test('most restrictive X-Robots-Tag wins over meta robots', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: 'index, follow',
    xRobotsTag: 'noindex',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canIndex, false);
});

test('specific user agent rule takes precedence over wildcard', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nAllow: /page',
    url: '/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, true);
});

test('longest path match wins in robots.txt', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /\nAllow: /page/',
    url: '/page/sub',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, true);
});

test('wildcard in robots.txt path matches any sequence', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /admin/*',
    url: '/admin/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, false);
});

test('meta none blocks both index and follow', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: 'none',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canIndex, false);
  assert.equal(result.canFollow, false);
});
