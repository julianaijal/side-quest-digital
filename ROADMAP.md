# Roadmap

## v1: one page site (live on https://side-quest-digital.com)

### Next up

**Julian (accounts, DNS and content)**
- [ ] 301 from `www.side-quest-digital.com` to the apex (Cloudflare redirect rule; the proxied `www` CNAME is already there)
- [ ] 301 from `.nl` and `.tech` (apex and `www`) to `https://side-quest-digital.com`, once Cloudflare marks the zones active
- [ ] `side-quest-digital.online`: registry `serverHold`, resolve with TransIP (likely an unverified registrant email), then add to Cloudflare and redirect
- [ ] Photo of Julian plus alt text (or hide the placeholder until there is one)
- [ ] Gmail "Send mail as" for the domain address, so replies come from the business address
- [ ] Google account on the domain address, for client Google Docs
- [ ] GitHub: "Keep my email addresses private" and a `noreply` commit email
- [ ] Optional: ask GitHub Support to purge cached commits from before the email scrub (PR #1)

**Code**
- [ ] Merge PR #1 into `main`
- [ ] CI workflow: lint, typecheck, test and commit message checks on pull requests (`AGENTS.md` mentions `scripts/git-workflow.ts`, which does not exist yet)
- [ ] Skip link as first focusable element
- [ ] Styled 404 page in the Night Reef theme (the status is already a real 404)
- [ ] Security headers (see checklist below)
- [ ] Before a photo goes in: add the Cloudflare Images binding for `next/image`, or serve a pre optimized image
- [ ] Web app manifest with a maskable icon

**Verify on the live domain** (from a network without Zscaler)
- [ ] Lighthouse mobile (local production build: performance 98, accessibility 100, best practices 100, SEO 100; LCP 2.3 s simulated)
- [ ] Rich Results Test for the JSON-LD
- [ ] Core Web Vitals from real users once there is traffic

### Done

- [x] Homepage in the Night Reef design: hero with side path, five services, about, contact, footer (desktop, 390 and 320 checked)
- [x] English copy, real details (in SEO since 2011, LinkedIn, KVK), email shown as `julian [@] side-quest-digital.com` and scrubbed from git history
- [x] SEO basics: metadata, JSON-LD, sitemap, robots, `llms.txt`, OG image, favicon
- [x] OpenNext and Wrangler config with `preview` and `deploy` scripts. Behind Zscaler, set `NODE_EXTRA_CA_CERTS` to the Zscaler root CA first.
- [x] Nameservers of `.com`, `.nl` and `.tech` at TransIP point to Cloudflare
- [x] `side-quest-digital.com` live as custom domain of the Worker, `workers.dev` disabled
- [x] Email Routing: the domain address forwards to Gmail (MX, SPF and DKIM verified)
- [x] CSS inlined, all motion behind `prefers-reduced-motion`, visible focus ring on every link and button

### Website specification checks

Checklist from [specification.website](https://specification.website/checklist/). Only the items that apply to a static one page site without accounts, forms or feeds. Some may already be covered; tick them off after verifying on the deployed site.

**Foundations**
- [x] Doctype, `lang="en"`, UTF-8 charset, viewport that allows zooming, one `<title>`
- [x] Meta description and canonical URL
- [x] Favicons: SVG, `/favicon.ico`, `apple-touch-icon`
- [ ] Maskable icon (with the web app manifest)
- [x] `theme-color` and `color-scheme` meta (dark only)
- [x] Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Consider the Popover API for the mobile menu (current version uses React state)

**SEO**
- [x] `robots.txt` and XML sitemap
- [x] Explicit meta robots policy
- [x] Primary content and metadata server rendered
- [x] Real 404 status for unknown URLs (no soft 404)
- [ ] Custom styled 404 page
- [x] Heading hierarchy without skipped levels
- [x] JSON-LD (`ProfessionalService`, `Person`)
- [ ] Redirects: www and non www to one host with a permanent redirect, no chains

**Accessibility**
- [ ] Skip link as first focusable element
- [x] Contrast (lowest text pair 6.5:1) and visible focus
- [ ] Focus not hidden behind the sticky nav (verify)
- [ ] Forced colors mode looks correct
- [x] Touch targets at least 44px
- [x] Reduced motion respected (all motion behind `prefers-reduced-motion`)
- [x] Status messages announced (copy button uses `aria-live`)
- [x] No empty links or buttons, descriptive link text, landmarks

**Security headers** (in `next.config.ts` `headers()`, or Cloudflare rules)
- [ ] HTTPS only with HSTS (`max-age`, `includeSubDomains`, no preload)
- [ ] Content Security Policy, including `frame-ancestors`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy`
- [ ] Cross origin isolation headers (COOP, CORP) where they do not break anything
- [ ] `/.well-known/security.txt`
- [ ] DNS CAA records for the domain

**Agent readiness**
- [x] `/llms.txt`
- [ ] Markdown version of the page (`/index.md` or content negotiation)
- [ ] `robots.txt` rules for named AI crawlers, optionally Content Signals
- [ ] HTTP `Link` headers for discovery (sitemap, llms.txt)

**Performance**
- [ ] Core Web Vitals within the good thresholds
- [ ] Images in AVIF or WebP with explicit dimensions, no lazy loading on the LCP element
- [ ] Cache headers: immutable for hashed assets, revalidate for HTML
- [ ] Brotli compression, HTTP/2 or HTTP/3 (Cloudflare default, verify)
- [x] Fonts as WOFF2, subset, `font-display: swap` (via `next/font`)
- [ ] Page eligible for the back/forward cache
- [ ] `scrollbar-gutter: stable`, `dvh` instead of `100vh` where relevant

**Privacy and resilience**
- [ ] Short privacy statement (Google Analytics only with consent, what happens with mail)
- [ ] Page content and navigation work without JavaScript
- [ ] Web app manifest
- [ ] External uptime monitoring
- [ ] Domain reachable over IPv6 (AAAA record)

### Open placeholders (in `content/site.ts`)

- [ ] Photo of Julian plus alt text
- [ ] Optional footer line with the measured page weight, once measured

## v2: headless CMS

Goal: Julian edits copy without touching code. The site stays static and fast.

- [ ] Choose a headless CMS. Criteria: English content, free or cheap at this size, good preview, no client side SDK needed at runtime, webhook to trigger a rebuild or revalidation on Cloudflare.
- [ ] Model the content after `content/site.ts`. Its shape is the contract: one singleton document for the page, with lists for services, steps and facts.
- [ ] Swap the source behind `getSite()` in `content/getSite.ts`. Components only receive data as props, so they stay unchanged.
- [ ] Keep `content/site.ts` as typed fallback and fixture for tests.
- [ ] Revalidate on publish (on demand revalidation through the OpenNext cache on Cloudflare) instead of fetching on every request.
- [ ] Run the copy rules test (`tests/content.test.ts`) against CMS content in CI, or validate on save in the CMS.
- [ ] Draft preview for unpublished changes.

## Later ideas

From the Night Reef design, left out of the first version on purpose:

- [ ] Availability badge with a start month ("Room for a new project from [month]") instead of the eyebrow
- [ ] Facts row under the hero (years in SEO, migrations, frontend background)
- [ ] Work section with anonymised cases (situation, approach, result), once there are real projects
- [ ] Day rate in the about facts

- [ ] Bring back the Process section (`components/Steps`, copy in `site.steps`) once there is a real way of working to show

- [ ] Subpages (for example case descriptions without client names, or articles), with View Transitions between pages
- [ ] Cookieless analytics, if wanted
- [ ] Dutch version
- [ ] Remove GEO if it stays a hype topic (layout for three cards: analytics full width)
