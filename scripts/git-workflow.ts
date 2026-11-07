// Checks the commits and branch name of a pull request against the git
// workflow in AGENTS.md: Conventional Commits with the type list and rules of
// commitlint config-conventional, and branches named <type>/<description>.
//
//   node scripts/git-workflow.ts <base sha> <head sha> <branch>
//
// Merge, revert, fixup and squash commits that git writes itself are skipped,
// as commitlint does. Exits 1 on any failure and prints a Markdown report.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const types = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
] as const;

const maxLineLength = 100;
const header = /^([^(:!\s]+)(?:\(([^)]*)\))?!?: (.*)$/;
const generated = /^(Merge (branch|pull request|remote-tracking branch) |Revert "|fixup! |squash! |amend! )/;

export function checkCommitMessage(message: string): string[] {
  const lines = message.replace(/\s+$/, '').split('\n');
  const first = lines[0] ?? '';
  if (generated.test(first)) return [];

  const errors: string[] = [];
  const match = first.match(header);
  if (!match) {
    return [`header "${first}" is not "<type>(<scope>): <subject>"`];
  }
  const [, type, scope, subject] = match;

  if (!(types as readonly string[]).includes(type)) errors.push(`type "${type}" is not one of ${types.join(', ')}`);
  if (scope !== undefined && (scope === '' || scope !== scope.toLowerCase())) {
    errors.push(`scope "${scope}" must be lower case and not empty`);
  }
  if (subject.trim() === '') errors.push('subject is empty');
  if (subject !== subject.trim()) errors.push('subject has leading or trailing spaces');
  if (/^\p{Lu}/u.test(subject)) errors.push(`subject "${subject}" starts with a capital`);
  if (subject.endsWith('.')) errors.push('subject ends with a full stop');
  if (first.length > maxLineLength) errors.push(`header is ${first.length} characters, max ${maxLineLength}`);

  if (lines.length > 1 && lines[1] !== '') errors.push('no blank line between header and body');
  lines.slice(1).forEach((line, index) => {
    if (line.length > maxLineLength && !/^\S+$|https?:\/\//.test(line)) {
      errors.push(`line ${index + 2} is ${line.length} characters, max ${maxLineLength}`);
    }
  });
  return errors;
}

export function checkBranchName(branch: string): string[] {
  if (branch === 'main' || branch.startsWith('dependabot/')) return [];
  const match = branch.match(/^([a-z]+)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (!match) return [`branch "${branch}" is not "<type>/<lower-case-description>"`];
  if (!(types as readonly string[]).includes(match[1])) {
    return [`branch type "${match[1]}" is not one of ${types.join(', ')}`];
  }
  return [];
}

function commits(base: string, head: string) {
  const log = execFileSync('git', ['log', '--format=%h%x1f%B%x1e', `${base}..${head}`], { encoding: 'utf8' });
  return log
    .split('\x1e')
    .map((entry) => entry.replace(/^\n/, ''))
    .filter((entry) => entry.trim() !== '')
    .map((entry) => {
      const [sha, message] = entry.split('\x1f');
      return { sha, message };
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [base, head, branch] = process.argv.slice(2);
  if (!base || !head || !branch) {
    console.error('Usage: node scripts/git-workflow.ts <base sha> <head sha> <branch>');
    process.exit(2);
  }

  const failures: string[] = [];
  for (const error of checkBranchName(branch)) failures.push(`- Branch: ${error}`);
  const list = commits(base, head);
  for (const { sha, message } of list) {
    for (const error of checkCommitMessage(message)) failures.push(`- \`${sha}\` ${error}`);
  }

  console.log(`## Git workflow\n\nBranch \`${branch}\`, ${list.length} commits checked.\n`);
  console.log(failures.length === 0 ? 'All good.' : failures.join('\n'));
  process.exit(failures.length === 0 ? 0 : 1);
}
