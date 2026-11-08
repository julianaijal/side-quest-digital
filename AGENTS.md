# Side Quest Digital

One page website for Side Quest Digital, the freelance consultancy of Julian Aijal (Amsterdam). Next.js (App Router), TypeScript, SASS modules, hosted on Cloudflare Workers via the OpenNext adapter (`@opennextjs/cloudflare`). Domains are registered at TransIP.

## Commands

- `npm run dev`: local dev server
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript without emit
- `npm test`: content checks (copy rules) and git workflow checks
- `npm run check:site -- <url> [--live]`: checks a running site (local build or live) for document basics, headings, skip link, headers, 404, robots, sitemap, manifest and security.txt
- `npm run check:lighthouse -- <url>`: runs Lighthouse (mobile) three times against a running site, takes the median run and fails below 90 for performance or below 100 for accessibility, best practices and SEO
- `npm run build`: production build
- `npm run preview`: build for Cloudflare and run it locally in the Workers runtime
- `npm run deploy`: build for Cloudflare, deploy the Worker (needs `wrangler login`), then ping IndexNow with the sitemap URLs (`npm run indexnow`; key in `lib/indexnow.ts`, file in `public/`)

## Project rules

- All visible copy is English (American spelling) and lives in `content/site.ts`. No CMS.
- Never mention client names or show client logos.
- No dashes or em dashes in visible copy, and avoid hyphenated words ("mail", not "e-mail").
- No invented stats, scores or testimonials. Unknown facts stay as `[bracketed]` placeholders until Julian fills them in. Search for `[` to find them.
- Dark theme only ("Night Reef" palette): sea green neutrals, mint as brand colour, sand only for actions and the quest marker. Keep text at 7:1 or more against its background; never lower contrast with opacity.
- Server components by default. Only `MobileMenu`, `CopyButton`, `LocalTime` and `CookieConsent` are client components.
- Motion is CSS only, wrapped in `prefers-reduced-motion: no-preference`. No UI or animation libraries.
- Analytics: Google Analytics 4 through Google Tag Manager (`lib/analytics.ts`), production builds only. Consent Mode v2 starts as "denied"; cookies are set only after the visitor clicks "Allow" in the cookie bar (`CookieConsent`). Key actions are tracked with a `data-track` attribute (`copy_email`, `cta_click`, `linkedin_click`) plus `data-track-location`; a click listener in the inline script pushes them to the dataLayer. The cookie bar pushes `consent_update` with `consent_choice` (`granted` or `denied`). Mention any new tracked action in the privacy statement. No other tracking.
- The base URL comes from `siteUrl()` in `lib/seo.ts`: `site.domain` once filled in, otherwise `NEXT_PUBLIC_SITE_URL`.
- `app/opengraph-image.png` and `app/apple-icon.png` are static files (Workers cannot read local fonts at runtime). Recreate the OG image when the hero title changes.
- Design tokens come from `styles/_tokens.scss` (`@use '@/styles/tokens' as *;`).

## Automation

- `.github/workflows/ci.yml`: on every pull request and push to `main`, runs lint, typecheck, tests, the build, and `check:site` against the build. Then it runs Lighthouse against the build (`scripts/check-lighthouse.ts`) and keeps the HTML report as a workflow artifact. On pull requests it also checks every commit message and the branch name (`scripts/git-workflow.ts`).
- `.github/workflows/site-watch.yml`: every Monday, checks the live site (`--live`) and fetches changes in the external website specification from the MCP endpoint in the repository variable `SPEC_MCP_URL`. Failures and changes open GitHub issues (labels `site-check` and `spec-change`). Do not name the specification in commits or code.
- `.github/workflows/uptime.yml`: every 15 minutes, checks that the homepage returns 200; opens an issue (label `uptime`) when it is down twice in a row and closes it once the site is back.
- When a rule changes, update `scripts/check-site.ts` with it, so CI keeps enforcing it.

## Git Workflow

- Always make small, focused commits: one logical change per commit.
- Do not batch unrelated changes into a single commit.
- All commits in English (American spelling, matching the code).
- Every commit leaves the project in a working state: lint, typecheck and tests pass.

### Commit messages

A plain subject line in the imperative, like the Git project itself: "Add IndexNow ping after each deploy". CI checks every commit in a pull request and the branch name (`scripts/git-workflow.ts`):

- No type prefix such as `feat:`, `fix:` or `ci:`.
- Start with a capital, no full stop at the end.
- Subject and every body and footer line at most 100 characters; wrap the body. A blank line between subject and body.
- Merge, revert, fixup and squash commits that git writes itself are skipped.

### Branch names

A short description in lower case kebab case, for example `indexnow-ping` or `design-polish`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
