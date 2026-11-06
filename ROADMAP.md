# Roadmap

## v1: one page site (current)

- [ ] Homepage built from the final design (desktop 1440, mobile 390)
- [ ] SEO basics: metadata, JSON-LD, sitemap, robots, `llms.txt`, OG image, favicon
- [ ] Lighthouse mobile 100 on all four categories
- [ ] Deploy to Vercel

### Open placeholders (all in `content/site.ts`, except where noted)

- [ ] Email address
- [ ] LinkedIn profile URL
- [ ] KVK number
- [ ] Years of experience
- [ ] Availability (days per month)
- [ ] Reply time
- [ ] Photo of Julian plus alt text
- [ ] Domain (`site.domain`, used for canonical, sitemap and JSON-LD)
- [ ] Optional footer line with the measured page weight, once measured

## v2: headless CMS

Goal: Julian edits copy without touching code. The site stays static and fast.

- [ ] Choose a headless CMS. Criteria: Dutch content, free or cheap at this size, good preview, no client side SDK needed at runtime, webhook for rebuilds on Vercel.
- [ ] Model the content after `content/site.ts`. Its shape is the contract: one singleton document for the page, with lists for services, steps and facts.
- [ ] Swap the source behind `getSite()` in `content/getSite.ts`. Components only receive data as props, so they stay unchanged.
- [ ] Keep `content/site.ts` as typed fallback and fixture for tests.
- [ ] Revalidate on publish (webhook to Vercel or on demand revalidation) instead of fetching on every request.
- [ ] Run the copy rules test (`tests/content.test.ts`) against CMS content in CI, or validate on save in the CMS.
- [ ] Draft preview for unpublished changes.

## Later ideas

- [ ] Subpages (for example case descriptions without client names, or articles), with View Transitions between pages
- [ ] Cookieless analytics, if wanted
- [ ] English version
