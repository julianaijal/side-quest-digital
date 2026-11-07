// Runs Lighthouse (mobile, the default) against a running copy of the site and
// checks the category scores against the minimums below.
//
//   node scripts/check-lighthouse.ts http://localhost:3000
//
// Writes lighthouse.report.html and lighthouse.report.json next to where it
// runs. Exits 1 when a score is below its minimum and prints a Markdown report
// with the failing audits, so CI can add it to the job summary.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:3000';

// Performance on shared CI runners varies from run to run, so it gets some
// room. The other categories are deterministic and must stay at 100.
const minimums: Record<string, number> = {
  performance: 90,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
};

const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'];

type Audit = { title: string; score: number | null; scoreDisplayMode: string; displayValue?: string };
type Report = {
  categories: Record<string, { title: string; score: number; auditRefs: { id: string; weight: number }[] }>;
  audits: Record<string, Audit>;
};

execFileSync(
  'npx',
  [
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox',
    '--output=json',
    '--output=html',
    '--output-path=./lighthouse',
  ],
  { stdio: 'inherit' },
);

const report: Report = JSON.parse(readFileSync('lighthouse.report.json', 'utf8'));

const lines: string[] = [`## Lighthouse for ${url}\n`, '| Category | Score | Minimum |', '| --- | --- | --- |'];
const failures: string[] = [];
let belowMinimum = false;

for (const [id, minimum] of Object.entries(minimums)) {
  const category = report.categories[id];
  const score = Math.round(category.score * 100);
  const ok = score >= minimum;
  lines.push(`| ${category.title} | ${ok ? '' : '❌ '}${score} | ${minimum} |`);
  if (ok) continue;
  belowMinimum = true;

  for (const ref of category.auditRefs) {
    const audit = report.audits[ref.id];
    const scored = audit.scoreDisplayMode === 'binary' || audit.scoreDisplayMode === 'numeric';
    if (ref.weight > 0 && scored && audit.score !== null && audit.score < 1) {
      failures.push(`- [ ] ${category.title}: ${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ''}`);
    }
  }
}

lines.push('', metrics.map((id) => `${report.audits[id].title}: ${report.audits[id].displayValue}`).join(' · '));
if (failures.length) lines.push('', ...failures);

console.log(lines.join('\n'));
process.exit(belowMinimum ? 1 : 0);
