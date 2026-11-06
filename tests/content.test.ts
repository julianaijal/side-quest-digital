import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../content/site.ts';

// Literal code samples that are shown as code, not as copy.
const codePaths = new Set(['snippets.robots']);
// Keys that hold identifiers, not visible copy.
const idKeys = new Set(['id', 'snippet']);

function collectStrings(value: unknown, path: string, out: Array<[string, string]>): void {
  if (codePaths.has(path) || idKeys.has(path.split('.').pop() ?? '')) return;
  if (typeof value === 'string') {
    out.push([path, value]);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, path, out));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, path ? `${path}.${key}` : key, out);
    }
  }
}

const strings: Array<[string, string]> = [];
collectStrings(site, '', strings);

test('copy contains no en or em dashes', () => {
  for (const [path, text] of strings) {
    assert.doesNotMatch(text, /[–—]/, `${path}: "${text}"`);
  }
});

test('copy contains no hyphenated words', () => {
  for (const [path, text] of strings) {
    if (/^https?:\/\//.test(text)) continue;
    assert.doesNotMatch(text, /\p{L}-\p{L}/u, `${path}: "${text}"`);
  }
});

test('copy contains no spaced hyphen used as a dash', () => {
  for (const [path, text] of strings) {
    assert.doesNotMatch(text, /\s-\s/, `${path}: "${text}"`);
  }
});
