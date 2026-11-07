import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBranchName, checkCommitMessage } from '../scripts/git-workflow.ts';

test('accepts conventional commit headers', () => {
  for (const message of [
    'feat: add a skip link as the first focusable element',
    'fix(ci): run tests with a glob so Node 24 finds them',
    'feat!: drop the light theme',
    'docs: add roadmap\n\nLonger body that explains why.\n\nCo-Authored-By: Someone <someone@example.com>',
  ]) {
    assert.deepEqual(checkCommitMessage(message), [], message);
  }
});

test('skips commits git writes itself', () => {
  for (const message of [
    'Merge pull request #2 from julianaijal/feat/homepage',
    "Merge branch 'main' into feat/homepage",
    'Revert "feat: add KVK number"',
    'fixup! feat: add footer',
  ]) {
    assert.deepEqual(checkCommitMessage(message), [], message);
  }
});

test('rejects commits that break the rules', () => {
  for (const message of [
    'first commit',
    'feature: add footer',
    'Feat: add footer',
    'feat(CI): add footer',
    'feat: Add footer',
    'feat: add footer.',
    'feat:add footer',
    `feat: ${'a'.repeat(100)}`,
    'feat: add footer\nbody without a blank line',
  ]) {
    assert.notDeepEqual(checkCommitMessage(message), [], message);
  }
});

test('accepts branch names with a type and description', () => {
  for (const branch of ['feat/homepage', 'ci/git-workflow-checks', 'fix/focus-ring', 'main']) {
    assert.deepEqual(checkBranchName(branch), [], branch);
  }
});

test('rejects other branch names', () => {
  for (const branch of ['homepage', 'feature/homepage', 'feat/Homepage', 'feat/home_page', 'feat/home--page']) {
    assert.notDeepEqual(checkBranchName(branch), [], branch);
  }
});
