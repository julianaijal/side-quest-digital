// Runs Lighthouse (mobile, the default) three times against a running copy of
// the site and checks the run with the median performance score against the
// minimums below. One slow run on a busy CI runner then does not fail a build.
//
//   node scripts/check-lighthouse.ts http://localhost:3000
//
// Keeps the median run as lighthouse.report.html and lighthouse.report.json.
// Exits 1 when a score is below its minimum and prints a Markdown report with
// the failing audits, so CI can add it to the job summary.

import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:3000';
const runs = 3;

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

// Lighthouse sometimes fails to record a trace on a busy CI runner (for
// example NO_NAVSTART). That says nothing about the page, so a crashed run is
// tried once more before the check fails.
function run(index: number, attempt = 1): Report {
  try {
    execFileSync(
      'npx',
      [
        'lighthouse',
        url,
        '--quiet',
        '--chrome-flags=--headless=new --no-sandbox',
        '--output=json',
        '--output=html',
        `--output-path=./lighthouse-${index}`,
      ],
      { stdio: 'inherit' },
    );
  } catch (error) {
    if (attempt > 1) throw error;
    console.error(`Lighthouse run ${index + 1} crashed, trying it once more.`);
    return run(index, attempt + 1);
  }
  return JSON.parse(readFileSync(`lighthouse-${index}.report.json`, 'utf8'));
}

const reports = Array.from({ length: runs }, (_, index) => ({ index, report: run(index) }));
const byPerformance = [...reports].sort(
  (a, b) => a.report.categories.performance.score - b.report.categories.performance.score,
);
const median = byPerformance[Math.floor(runs / 2)];
for (const extension of ['html', 'json']) {
  copyFileSync(`lighthouse-${median.index}.report.${extension}`, `lighthouse.report.${extension}`);
}
for (const { index } of reports) {
  for (const extension of ['html', 'json']) rmSync(`lighthouse-${index}.report.${extension}`);
}
const report = median.report;
const performanceScores = reports.map(({ report }) => Math.round(report.categories.performance.score * 100));

const lines: string[] = [
  `## Lighthouse for ${url}\n`,
  `Median of ${runs} runs (performance ${performanceScores.join(', ')}).\n`,
  '| Category | Score | Minimum |',
  '| --- | --- | --- |',
];
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
