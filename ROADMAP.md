# Roadmap

## v1: one page site (current)

- [ ] Homepage built from the final design (desktop 1440, mobile 390)
- [x] SEO basics: metadata, JSON-LD, sitemap, robots, `llms.txt`, OG image, favicon
- [ ] Validate JSON-LD in the Rich Results Test once the site is live
- [ ] Lighthouse mobile 100 on all four categories
- [x] OpenNext and Wrangler config with `preview` and `deploy` scripts
- [x] First deploy to Cloudflare Workers (`wrangler login`, then `npm run deploy`). Behind Zscaler, set `NODE_EXTRA_CA_CERTS` to the Zscaler root CA first.
- [ ] Before a photo goes in: add the Cloudflare Images binding for `next/image`, or serve a pre optimized image
- [x] Nameservers of `.com`, `.nl` and `.tech` at TransIP point to Cloudflare
- [x] `side-quest-digital.com` live as custom domain of the Worker, `workers.dev` disabled
- [ ] 301 from `www.side-quest-digital.com` to the apex (Cloudflare redirect rule)
- [ ] 301 from `.nl` and `.tech` (apex and `www`) to `https://side-quest-digital.com`, once the zones are active
- [ ] `side-quest-digital.online`: registry `serverHold`, resolve with TransIP first, then add to Cloudflare and redirect

### Website specification checks

Checklist from [specification.website](https://specification.website/checklist/). Only the items that apply to a static one page site without accounts, forms or feeds. Some may already be covered; tick them off after verifying on the deployed site.

**Foundations**
- [ ] Doctype, `lang="en"`, UTF-8 charset, viewport that allows zooming, one `<title>`
- [ ] Meta description and canonical URL
- [ ] Favicons: SVG, `/favicon.ico`, `apple-touch-icon`, maskable icon
- [ ] `theme-color` and `color-scheme` meta (light only for v1)
- [ ] Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Consider the Popover API for the mobile menu (current version uses React state)

**SEO**
- [ ] `robots.txt` and XML sitemap
- [ ] Explicit meta robots policy
- [ ] Primary content and metadata server rendered
- [ ] Custom 404 that returns a real 404 status (no soft 404)
- [ ] Heading hierarchy without skipped levels
- [ ] JSON-LD (`ProfessionalService`, `Person`)
- [ ] Redirects: www and non www to one host with a permanent redirect, no chains

**Accessibility**
- [ ] Skip link as first focusable element
- [ ] Contrast, visible focus, focus not hidden behind the sticky nav
- [ ] Forced colors mode looks correct
- [ ] Touch targets at least 44px
- [ ] Reduced motion respected (all motion already behind `prefers-reduced-motion`)
- [ ] Status messages announced (copy button uses `aria-live`)
- [ ] No empty links or buttons, descriptive link text, landmarks

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
- [ ] `/llms.txt`
- [ ] Markdown version of the page (`/index.md` or content negotiation)
- [ ] `robots.txt` rules for named AI crawlers, optionally Content Signals
- [ ] HTTP `Link` headers for discovery (sitemap, llms.txt)

**Performance**
- [ ] Core Web Vitals within the good thresholds
- [ ] Images in AVIF or WebP with explicit dimensions, no lazy loading on the LCP element
- [ ] Cache headers: immutable for hashed assets, revalidate for HTML
- [ ] Brotli compression, HTTP/2 or HTTP/3 (Cloudflare default, verify)
- [ ] Fonts as WOFF2, subset, `font-display: swap` (via `next/font`)
- [ ] Page eligible for the back/forward cache
- [ ] `scrollbar-gutter: stable`, `dvh` instead of `100vh` where relevant

**Privacy and resilience**
- [ ] Short privacy statement (no cookies, no tracking, what happens with mail)
- [ ] Page content and navigation work without JavaScript
- [ ] Web app manifest
- [ ] External uptime monitoring
- [ ] Domain reachable over IPv6 (AAAA record)

### Open placeholders (all in `content/site.ts`, except where noted)

- [ ] Email address
- [ ] LinkedIn profile URL
- [ ] KVK number
- [ ] Years of experience
- [ ] Availability (days per month)
- [ ] Reply time
- [ ] Photo of Julian plus alt text
- [x] Domain (`site.domain`, used for canonical, sitemap and JSON-LD): `side-quest-digital.com`
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

- [ ] Bring back the Process section (`components/Steps`, copy in `site.steps`) once there is a real way of working to show

- [ ] Subpages (for example case descriptions without client names, or articles), with View Transitions between pages
- [ ] Cookieless analytics, if wanted
- [ ] Dutch version
