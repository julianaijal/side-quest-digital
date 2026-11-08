// Checks the commits and branch name of a pull request against the git
// workflow in AGENTS.md: a short subject in the imperative, starting with a
// capital and without a type prefix such as "feat:", and short kebab case
// branch names.
//
//   node scripts/git-workflow.ts <base sha> <head sha> <branch>
//
// Merge, revert, fixup and squash commits that git writes itself are skipped.
// Exits 1 on any failure and prints a Markdown report.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const maxLineLength = 100;
const generated = /^(Merge (branch|pull request|remote-tracking branch) |Revert "|fixup! |squash! |amend! )/;
// A Conventional Commits style prefix like "feat:" or "fix(nav):".
const typePrefix = /^[a-z]+(\([^)]*\))?!?: /;

export function checkCommitMessage(message: string): string[] {
  const lines = message.replace(/\s+$/, '').split('\n');
  const subject = lines[0] ?? '';
  if (generated.test(subject)) return [];

  const errors: string[] = [];
  if (subject.trim() === '') errors.push('subject is empty');
  if (subject !== subject.trim()) errors.push('subject has leading or trailing spaces');
  if (typePrefix.test(subject)) errors.push(`subject "${subject}" has a type prefix; write a plain sentence`);
  if (/^\p{Ll}/u.test(subject)) errors.push(`subject "${subject}" starts with a lower case letter`);
  if (subject.endsWith('.')) errors.push('subject ends with a full stop');
  if (subject.length > maxLineLength) errors.push(`subject is ${subject.length} characters, max ${maxLineLength}`);

  if (lines.length > 1 && lines[1] !== '') errors.push('no blank line between subject and body');
  lines.slice(1).forEach((line, index) => {
    if (line.length > maxLineLength && !/^\S+$|https?:\/\//.test(line)) {
      errors.push(`line ${index + 2} is ${line.length} characters, max ${maxLineLength}`);
    }
  });
  return errors;
}

export function checkBranchName(branch: string): string[] {
  if (branch === 'main' || branch.startsWith('dependabot/')) return [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(branch)) {
    return [`branch "${branch}" is not a short kebab case description, like "indexnow-ping"`];
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
