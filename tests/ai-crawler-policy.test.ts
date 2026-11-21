import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crawlers } from '../components/AiCrawlerPolicy/crawlers.ts';
import {
  generateRobotsTxt,
  generateMetaTags,
  generateHttpHeaders,
  generateContentSignals,
} from '../components/AiCrawlerPolicy/generate.ts';

test('blocks training crawlers when aiTrain is off', () => {
  const result = generateRobotsTxt({ search: true, aiInput: true, aiTrain: false }, crawlers);
  assert.match(result, /User-agent: GPTBot\nDisallow: \//);
  assert.doesNotMatch(result, /User-agent: Googlebot\nDisallow/);
});

test('meta tags include Content Signals when aiTrain is off', () => {
  const result = generateMetaTags({ search: true, aiInput: true, aiTrain: false });
  assert.match(result, /content-signals/i);
  assert.match(result, /ai-train=no/);
});

test('all toggles off produces wildcard block', () => {
  const result = generateRobotsTxt({ search: false, aiInput: false, aiTrain: false }, crawlers);
  assert.match(result, /User-agent: \*\nDisallow: \//);
});

test('all toggles on produces no blocks', () => {
  const result = generateRobotsTxt({ search: true, aiInput: true, aiTrain: true }, crawlers);
  assert.doesNotMatch(result, /Disallow: \//);
});

test('HTTP headers reflect settings', () => {
  const result = generateHttpHeaders({ search: true, aiInput: false, aiTrain: false });
  assert.match(result, /X-Robots-Tag/i);
  assert.match(result, /noai/i);
});

test('Content Signals reflect settings', () => {
  const result = generateContentSignals({ search: true, aiInput: true, aiTrain: false });
  assert.match(result, /search=yes/);
  assert.match(result, /ai-input=yes/);
  assert.match(result, /ai-train=no/);
});

test('search off blocks all crawlers including search engines', () => {
  const result = generateRobotsTxt({ search: false, aiInput: false, aiTrain: false }, crawlers);
  assert.match(result, /User-agent: \*/);
});
