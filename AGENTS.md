# Side Quest Digital

One page website for Side Quest Digital, the freelance consultancy of Julian Aijal (Amsterdam). Next.js (App Router), TypeScript, SASS modules, deployed to Vercel.

## Commands

- `npm run dev`: local dev server
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript without emit
- `npm test`: content checks (copy rules)
- `npm run build`: production build

## Project rules

- All visible copy is Dutch and lives in `content/site.ts`. No CMS.
- Never mention client names or show client logos.
- No dashes or em dashes in visible copy, and avoid hyphenated words ("mail", not "e-mail").
- No invented stats, scores or testimonials. Unknown facts stay as `[bracketed]` placeholders until Julian fills them in. Search for `[` to find them.
- Light theme only for v1.
- Server components by default. Only `MobileMenu`, `CopyButton` and `LocalTime` are client components.
- Motion is CSS only, wrapped in `prefers-reduced-motion: no-preference`. No UI or animation libraries.
- No tracking cookies.
- Design tokens come from `styles/_tokens.scss` (`@use '@/styles/tokens' as *;`).

## Git Workflow

- Always make small, focused commits: one logical change per commit.
- Do not batch unrelated changes into a single commit.
- All commits in English (American spelling, matching the code).
- Every commit leaves the project in a working state: lint, typecheck and tests pass.

### Commit messages

Follow [Conventional Commits 1.0](https://www.conventionalcommits.org), with the type list and rules of [commitlint config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional). CI checks the format of every commit in a pull request and the branch name (`scripts/git-workflow.ts`, decision 25):
