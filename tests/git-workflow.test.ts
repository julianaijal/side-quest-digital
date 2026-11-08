import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBranchName, checkCommitMessage } from '../scripts/git-workflow.ts';

test('accepts plain imperative subjects', () => {
  for (const message of [
    'Add a skip link as the first focusable element',
    'Run tests with a glob so Node 24 finds them',
    '`check:site` checks the JSON-LD images',
    'Add roadmap\n\nLonger body that explains why.\n\nCo-Authored-By: Someone <someone@example.com>',
  ]) {
    assert.deepEqual(checkCommitMessage(message), [], message);
  }
});

test('skips commits git writes itself', () => {
  for (const message of [
    'Merge pull request #2 from julianaijal/feat/homepage',
    "Merge branch 'main' into indexnow-ping",
    'Revert "Add KVK number"',
    'fixup! Add footer',
  ]) {
    assert.deepEqual(checkCommitMessage(message), [], message);
  }
});

test('rejects commits that break the rules', () => {
  for (const message of [
    'feat: add footer',
    'fix(nav): close the menu',
    'docs!: drop the roadmap',
    'add footer',
    'Add footer.',
    ' Add footer',
    `Add ${'a'.repeat(100)}`,
    'Add footer\nbody without a blank line',
  ]) {
    assert.notDeepEqual(checkCommitMessage(message), [], message);
  }
});

test('accepts short kebab case branch names', () => {
  for (const branch of ['indexnow-ping', 'design-polish', 'homepage', 'main', 'dependabot/npm_and_yarn/next-16.5.0']) {
    assert.deepEqual(checkBranchName(branch), [], branch);
  }
});

test('rejects other branch names', () => {
  for (const branch of ['feat/homepage', 'Homepage', 'home_page', 'home--page', '-home']) {
    assert.notDeepEqual(checkBranchName(branch), [], branch);
  }
});
