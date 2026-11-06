# Side Quest Digital

One page website for Side Quest Digital, the freelance consultancy of Julian Aijal (Amsterdam). Next.js (App Router), TypeScript, SASS modules, hosted on Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`). Domains are registered at TransIP.

## Commands

- `npm run dev`: local dev server
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript without emit
- `npm test`: content checks (copy rules)
- `npm run build`: production build
- `npm run preview`: build for Cloudflare and run it locally in the Workers runtime
- `npm run deploy`: build for Cloudflare and deploy the Worker (needs `wrangler login`)

## Project rules

- All visible copy is English (American spelling) and lives in `content/site.ts`. No CMS.
- Never mention client names or show client logos.
- No dashes or em dashes in visible copy, and avoid hyphenated words ("mail", not "e-mail").
- No invented stats, scores or testimonials. Unknown facts stay as `[bracketed]` placeholders until Julian fills them in. Search for `[` to find them.
- Dark theme only ("Nacht 2" palette): sea green neutrals, mint as brand colour, sand only for actions and the quest marker. Keep text at 7:1 or more against its background; never lower contrast with opacity.
- Server components by default. Only `MobileMenu`, `CopyButton` and `LocalTime` are client components.
- Motion is CSS only, wrapped in `prefers-reduced-motion: no-preference`. No UI or animation libraries.
- No tracking cookies.
- The base URL comes from `siteUrl()` in `lib/seo.ts`: `site.domain` once filled in, otherwise `NEXT_PUBLIC_SITE_URL`.
- `app/opengraph-image.png` and `app/apple-icon.png` are static files (Workers cannot read local fonts at runtime). Recreate the OG image when the hero title changes.
- Design tokens come from `styles/_tokens.scss` (`@use '@/styles/tokens' as *;`).

## Git Workflow

- Always make small, focused commits: one logical change per commit.
- Do not batch unrelated changes into a single commit.
- All commits in English (American spelling, matching the code).
- Every commit leaves the project in a working state: lint, typecheck and tests pass.

### Commit messages

Follow [Conventional Commits 1.0](https://www.conventionalcommits.org), with the type list and rules of [commitlint config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional). CI checks the format of every commit in a pull request and the branch name (`scripts/git-workflow.ts`, decision 25):

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
