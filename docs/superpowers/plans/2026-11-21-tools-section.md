# Tools Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/tools/` section with three tools: rendering timer, AI crawler policy generator and crawl policy conflict resolver.

**Architecture:** A shared tools layout under `app/tools/` with a `PageHeader`-style nav. Each tool is a static route with a server-rendered intro and a client component for the interactive part. Tool metadata lives in `content/site.ts`; the overview page and sitemap read from it. All tools are pre-rendered at build time.

**Tech Stack:** Next.js App Router, TypeScript, SASS modules, existing Night Reef design tokens.

**Spec:** `docs/superpowers/specs/2026-11-21-tools-section-design.md`

## Global Constraints

- American English copy; all visible text in `content/site.ts`.
- No em dashes anywhere.
- No hyphenated words in copy ("email", not "e-mail").
- Night Reef dark theme; text at 7:1+ contrast; use `$theme-*` tokens, never palette values directly.
- CSS-only motion inside `@include motion-ok`.
- No UI or animation libraries.
- Server components by default; `'use client'` only where the tool needs interactivity.
- Baseline Widely available features only. Newly available as progressive enhancement.
- `npm run lint`, `npm run typecheck` and `npm test` must pass after every task.
- Commit messages: imperative, capital start, no type prefix, no period, max 100 chars.

## Review Focus

1. **Empty/malformed robots.txt input in the crawl policy resolver**: a user pastes garbage or nothing. The resolver must show a sensible empty state, not crash or show a misleading verdict.
2. **Unknown crawler name in the AI policy generator**: a user picks a crawler not in the built-in list (via "Other" or future expansion). The output must still produce valid robots.txt syntax.
3. **`?auto` on the rendering timer without JS**: if a crawler visits `?auto` but does not execute JS, the page must still be valid HTML with the server-rendered intro (no blank page).
4. **Copy with brackets `[` in `content/site.ts`**: the existing test checks for dashes. New copy must not introduce `[bracketed]` placeholders without intent, since they signal "Julian fills this in later".
5. **CLS from tool output areas**: if the reserved `min-height` on a tool's output area is too small and the actual output exceeds it, content shifts. Each tool's output area must accommodate the largest realistic output.

---

## File Structure

```
content/site.ts                          Modify: add tools section copy and tool registry
lib/seo.ts                               Modify: add tools JSON-LD helper
app/tools/layout.tsx                     Create: shared tools layout (PageHeader + Footer)
app/tools/layout.module.scss             Create: tools layout styles
app/tools/page.tsx                       Create: overview page (card grid)
app/tools/page.module.scss               Create: overview page styles
app/tools/rendering-timer/page.tsx       Create: rendering timer tool page
app/tools/rendering-timer/page.module.scss Create: rendering timer styles
components/RenderingTimer/RenderingTimer.tsx Create: client component
components/RenderingTimer/RenderingTimer.module.scss Create: timer styles
app/tools/ai-crawler-policy/page.tsx     Create: AI crawler policy tool page
app/tools/ai-crawler-policy/page.module.scss Create: tool page styles
components/AiCrawlerPolicy/AiCrawlerPolicy.tsx Create: client component
components/AiCrawlerPolicy/AiCrawlerPolicy.module.scss Create: component styles
components/AiCrawlerPolicy/crawlers.ts   Create: crawler data
components/AiCrawlerPolicy/generate.ts   Create: pure output generation functions
app/tools/crawl-policy-resolver/page.tsx Create: crawl policy resolver tool page
app/tools/crawl-policy-resolver/page.module.scss Create: tool page styles
components/CrawlPolicyResolver/CrawlPolicyResolver.tsx Create: client component
components/CrawlPolicyResolver/CrawlPolicyResolver.module.scss Create: component styles
components/CrawlPolicyResolver/parse.ts  Create: robots.txt parser + directive resolver
app/sitemap.ts                           Modify: add tool pages
app/llms.txt/route.ts                    Modify: add tools section
tests/content.test.ts                    Modify: ensure new copy passes existing rules
```

---

### Task 1: Tool registry and site copy

**Files:**
- Modify: `content/site.ts`
- Modify: `tests/content.test.ts` (verify new copy passes)

**Interfaces:**
- Consumes: existing `site` object shape
- Produces: `site.tools` with `meta`, `title`, `intro`, `nav` and `items` array. Each item has `slug: string`, `title: string`, `description: string`, `tag: string` and tool-specific copy fields.

- [ ] **Step 1: Add `tools` to `content/site.ts`**

Add a `tools` key after `cookies`. It contains:
- `meta: { title, description }` for the overview page metadata.
- `nav` label: `'Tools'` (the label added to the main site nav).
- `title`: section heading for the overview page.
- `intro`: one-line intro for the overview page.
- `backLabel`: "Back to tools" for individual tool pages.
- `items`: array of three tool entries, each with `slug`, `title`, `description`, `tag` and tool-specific copy.

The rendering timer item also carries: `startLabel`, `resetLabel`, `completeLabel`, `autoDescription` (explains `?auto`), `intro` (the page intro text).

The AI crawler policy item carries: `intro`, `searchLabel`, `aiSearchLabel`, `aiTrainingLabel`, `copyLabel`, `copiedLabel`.

The crawl policy resolver item carries: `intro`, `resolveLabel`, `userAgentLabel`.

Also add `{ label: 'Tools', href: '/tools/' }` to `site.nav`.

- [ ] **Step 2: Run `npm test` to verify new copy passes content rules**

Run: `npm test`
Expected: PASS. No dashes, no em dashes, no spaced hyphens in the new copy.

- [ ] **Step 3: Run `npm run typecheck`**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```
git add content/site.ts
git commit -m "Add tools section copy and registry to site content"
```

---

### Task 2: Tools layout and overview page

**Files:**
- Create: `app/tools/layout.tsx`
- Create: `app/tools/layout.module.scss`
- Create: `app/tools/page.tsx`
- Create: `app/tools/page.module.scss`

**Interfaces:**
- Consumes: `site.tools` from Task 1, `PageHeader` component, `Footer` component, `getSite()`
- Produces: the `/tools/` route with layout wrapping all tool pages

- [ ] **Step 1: Create `app/tools/layout.tsx`**

Server component. Uses `PageHeader` (like the privacy page) with `site.tools.backLabel` as the label that links to `/`. Wraps `{children}` in a centered container. Renders `Footer` at the bottom.

The container has `max-width: $max-width`, horizontal padding `$gutter` (mobile: `$gutter-mobile`), vertical padding `$section-y` (mobile: `$section-y-mobile`).

- [ ] **Step 2: Create `app/tools/layout.module.scss`**

Styles for the container. Import tokens with `@use '@/styles/tokens' as *`.

- [ ] **Step 3: Create `app/tools/page.tsx`**

Server component. Exports `metadata` with `title` and `description` from `site.tools.meta`, `alternates: { canonical: '/tools/' }`.

Renders the section title (`<h1>`), intro text, and a grid of cards. Each card is a `<Link>` to `/tools/${item.slug}/` showing the item's `title`, `description` and `tag` as a chip.

- [ ] **Step 4: Create `app/tools/page.module.scss`**

Card grid: CSS Grid, same gap as the services section (`$card-gap`). Cards use `$theme-surface` background, `$radius-lg` border radius. Hover: `$theme-border-strong` border, wrapped in `@include hover`. Tag chips use `$theme-chip` background, `$radius-sm`.

- [ ] **Step 5: Run `npm run lint && npm run typecheck`**

Expected: PASS.

- [ ] **Step 6: Run `npm run dev`, open `/tools/` in a browser, verify the overview renders**

Check: title, intro, card grid visible. Cards link to tool slugs. Night Reef styling matches the rest of the site. Mobile layout (390px) has 16px gutters, cards stack.

- [ ] **Step 7: Commit**

```
git add app/tools/
git commit -m "Add tools layout and overview page"
```

---

### Task 3: MobileMenu navigation link support

**Files:**
- Modify: `components/Nav/MobileMenu.tsx`

**Interfaces:**
- Consumes: `links` array from `site.nav`, which now includes `{ label: 'Tools', href: '/tools/' }`
- Produces: mobile menu that works for both anchor links (`#services`) and navigation links (`/tools/`)

- [ ] **Step 1: Update `MobileMenu` close behavior**

Currently `onClick={close}` calls `hidePopover()` on every link click. For anchor links this is correct (same-page scroll). For navigation links (href starts with `/`), the browser navigates away and the popover closes naturally. The `close()` call is harmless for navigation links since the page unloads, so no change to the click handler is needed.

Verify this by testing: click "Tools" in mobile menu, confirm it navigates to `/tools/` and the menu is not stuck open on back-navigation.

- [ ] **Step 2: Test in browser at mobile width**

Open `npm run dev`, resize to 390px. Open mobile menu, verify "Tools" link appears and navigates to `/tools/`. Press back, verify menu is closed.

- [ ] **Step 3: Commit (only if changes were needed)**

If the existing code already handles navigation links correctly, no commit. If a change was needed:

```
git add components/Nav/MobileMenu.tsx
git commit -m "Support navigation links in the mobile menu"
```

---

### Task 4: Rendering timer tool

**Files:**
- Create: `app/tools/rendering-timer/page.tsx`
- Create: `app/tools/rendering-timer/page.module.scss`
- Create: `components/RenderingTimer/RenderingTimer.tsx`
- Create: `components/RenderingTimer/RenderingTimer.module.scss`

**Interfaces:**
- Consumes: `site.tools.items[0]` (rendering timer copy), design tokens
- Produces: `/tools/rendering-timer/` route with working timer

- [ ] **Step 1: Create `components/RenderingTimer/RenderingTimer.tsx`**

`'use client'` component. Props: `{ startLabel: string; resetLabel: string; completeLabel: string; autoStart: boolean }`.

State: `status: 'idle' | 'running' | 'complete'`, `elapsed: number`, `milestones: number[]` (the ms values that have been reached).

Milestone thresholds: `[100, 250, 500, 1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000]`.

On start (button click or `autoStart` on mount):
- Record `performance.now()` as start time.
- Use `requestAnimationFrame` loop to update `elapsed`.
- Use `setTimeout` for each milestone to add it to the milestones array.
- After 20000 ms, set status to `'complete'`.

Render:
- A start/reset button (hidden when `autoStart` and status is not `'complete'`).
- A running counter showing elapsed ms (formatted as `Xs Yms`). Uses `aria-live="off"`.
- An ordered list of milestones. Each rendered milestone shows:
  - A visual bar segment (width proportional to the gap between this and the previous milestone).
  - Human-readable label: "100 ms", "1 s", "5 s", etc.
  - Searchable marker text: `sqd-render-100`, `sqd-render-500`, etc.
- Final status announced with `aria-live="polite"`.

`prefers-reduced-motion`: use a CSS media query on the progress bar fill. The bar snaps to its width instead of animating. The counter still updates.

Reserve a `min-height` on the milestone list area to prevent CLS.

- [ ] **Step 2: Create `components/RenderingTimer/RenderingTimer.module.scss`**

Styles for the timer. Progress bar uses `$theme-accent` for filled segments. Milestone labels use `$font-mono`. The searchable marker text is visually muted (`$theme-text-3`, `$fs-label`). Start button uses `$theme-action` / `$theme-action-hover` (same as the site CTA).

Bar animation wrapped in `@include motion-ok`.

- [ ] **Step 3: Create `app/tools/rendering-timer/page.tsx`**

Server component. Exports `metadata` with title (`Rendering timer · Side Quest Digital`), description from the tool's `description`, and `alternates: { canonical: '/tools/rendering-timer/' }`.

Reads `searchParams` for `auto` query parameter. Renders:
- `<h1>` with the tool title.
- Intro paragraphs from tool copy.
- `<RenderingTimer autoStart={!!searchParams.auto} ... />` with labels from site content.
- A `<script type="application/ld+json">` with `SoftwareApplication` schema (name, description, url, `applicationCategory: "WebApplication"`, `offers: { "@type": "Offer", "price": "0" }`).

- [ ] **Step 4: Create `app/tools/rendering-timer/page.module.scss`**

Page-level styles. The intro text uses `$theme-text-2`, `$fs-lead`. Same pattern as the privacy page.

- [ ] **Step 5: Run `npm run lint && npm run typecheck`**

Expected: PASS.

- [ ] **Step 6: Test in browser**

Open `/tools/rendering-timer/`. Click Start: timer runs, milestones appear progressively. Counter shows elapsed time. After 20s, shows "Complete". Reset button resets to idle.

Open `/tools/rendering-timer/?auto`: timer starts immediately on load.

Check at 390px mobile width. Check with `prefers-reduced-motion: reduce` in DevTools (bar should not animate, timer still runs).

- [ ] **Step 7: Commit**

```
git add components/RenderingTimer/ app/tools/rendering-timer/
git commit -m "Add rendering timer tool"
```

---

### Task 5: AI crawler policy generator

**Files:**
- Create: `components/AiCrawlerPolicy/crawlers.ts`
- Create: `components/AiCrawlerPolicy/generate.ts`
- Create: `components/AiCrawlerPolicy/AiCrawlerPolicy.tsx`
- Create: `components/AiCrawlerPolicy/AiCrawlerPolicy.module.scss`
- Create: `app/tools/ai-crawler-policy/page.tsx`
- Create: `app/tools/ai-crawler-policy/page.module.scss`

**Interfaces:**
- Consumes: `site.tools.items[1]` (AI crawler policy copy), design tokens
- Produces: `/tools/ai-crawler-policy/` route with working generator

- [ ] **Step 1: Write tests for the pure generation functions**

Create `tests/ai-crawler-policy.test.ts`. Test `generateRobotsTxt`, `generateMetaTags`, `generateHttpHeaders` and `generateContentSignals`:

```ts
test('generateRobotsTxt blocks training crawlers when ai-train is off', () => {
  const result = generateRobotsTxt({ search: true, aiInput: true, aiTrain: false }, allCrawlers);
  assert.match(result, /User-agent: GPTBot\nDisallow: \//);
  assert.doesNotMatch(result, /User-agent: Googlebot\nDisallow/);
});

test('generateMetaTags includes Content Signals meta', () => {
  const result = generateMetaTags({ search: true, aiInput: true, aiTrain: false });
  assert.match(result, /content-signals/);
  assert.match(result, /ai-train=no/);
});

test('all toggles off produces full block', () => {
  const result = generateRobotsTxt({ search: false, aiInput: false, aiTrain: false }, allCrawlers);
  assert.match(result, /User-agent: \*\nDisallow: \//);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (modules not found).

- [ ] **Step 3: Create `components/AiCrawlerPolicy/crawlers.ts`**

Export `type AiCrawler = { name: string; operator: string; purpose: 'search' | 'training' | 'both' }` and `const crawlers: AiCrawler[]` with the ten crawlers from the spec.

- [ ] **Step 4: Create `components/AiCrawlerPolicy/generate.ts`**

Export type `PolicySettings = { search: boolean; aiInput: boolean; aiTrain: boolean }`.

Export four pure functions:
- `generateRobotsTxt(settings: PolicySettings, crawlers: AiCrawler[]): string`
- `generateMetaTags(settings: PolicySettings): string`
- `generateHttpHeaders(settings: PolicySettings): string`
- `generateSummary(settings: PolicySettings): string`

Each returns a ready-to-copy string. The robots.txt function groups crawlers by the action needed (block all training crawlers when `aiTrain` is false, block all when `search` is false). The Content Signals values follow the spec: `search=yes|no, ai-input=yes|no, ai-train=yes|no`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Create `components/AiCrawlerPolicy/AiCrawlerPolicy.tsx`**

`'use client'` component. Props: label strings from site content.

State: `PolicySettings` (three booleans, default all true).

Renders:
- Three `<fieldset>` groups, each with a `<legend>` and a checkbox toggle.
- An output area with four tabs (robots.txt, Meta tags, HTTP headers, Summary). Tab UI uses `role="tablist"` / `role="tab"` / `role="tabpanel"` with arrow key navigation.
- Each tab panel shows the generated output in a `<pre>` block with a copy button (reuse the same pattern as `CopyButton` in Contact).
- Output area has `aria-live="polite"` on the active panel.
- Reserve `min-height` on the output area.

- [ ] **Step 7: Create `components/AiCrawlerPolicy/AiCrawlerPolicy.module.scss`**

Fieldsets with no border. Toggle checkboxes styled as switches using `$theme-accent`. Tab bar uses `$theme-surface` background. Active tab uses `$theme-accent` underline. Code output uses `$font-mono`, `$theme-inset` background. Copy button same as the existing contact copy button.

- [ ] **Step 8: Create `app/tools/ai-crawler-policy/page.tsx` and styles**

Server component. Same pattern as the rendering timer page: metadata, canonical, `<h1>`, intro, client component, `SoftwareApplication` JSON-LD.

- [ ] **Step 9: Run `npm run lint && npm run typecheck`**

Expected: PASS.

- [ ] **Step 10: Test in browser**

Open `/tools/ai-crawler-policy/`. Toggle each option: output updates live. Copy buttons work. Tab switching works with keyboard (arrow keys). Check at 390px. Verify no CLS when toggling.

- [ ] **Step 11: Commit**

```
git add components/AiCrawlerPolicy/ app/tools/ai-crawler-policy/ tests/ai-crawler-policy.test.ts
git commit -m "Add AI crawler policy generator tool"
```

---

### Task 6: Crawl policy conflict resolver

**Files:**
- Create: `components/CrawlPolicyResolver/parse.ts`
- Create: `components/CrawlPolicyResolver/CrawlPolicyResolver.tsx`
- Create: `components/CrawlPolicyResolver/CrawlPolicyResolver.module.scss`
- Create: `app/tools/crawl-policy-resolver/page.tsx`
- Create: `app/tools/crawl-policy-resolver/page.module.scss`

**Interfaces:**
- Consumes: `site.tools.items[2]` (crawl policy resolver copy), design tokens
- Produces: `/tools/crawl-policy-resolver/` route with working resolver

- [ ] **Step 1: Write tests for the parser and resolver**

Create `tests/crawl-policy-resolver.test.ts`. Test `parseRobotsTxt`, `parseMetaRobots`, `resolvePolicy`:

```ts
test('robots.txt disallow blocks crawling', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /',
    url: '/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, false);
});

test('noindex in meta robots blocks indexing', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: 'noindex, follow',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canIndex, false);
  assert.equal(result.canFollow, true);
});

test('robots.txt block + meta noindex produces conflict warning', () => {
  const result = resolvePolicy({
    robotsTxt: 'User-agent: *\nDisallow: /',
    url: '/page',
    metaRobots: 'noindex',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.ok(result.conflicts.length > 0);
  assert.ok(result.conflicts[0].includes('never be seen'));
});

test('empty input returns open policy with no conflicts', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: '',
    xRobotsTag: '',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canCrawl, true);
  assert.equal(result.canIndex, true);
  assert.equal(result.conflicts.length, 0);
});

test('most restrictive X-Robots-Tag wins over meta robots', () => {
  const result = resolvePolicy({
    robotsTxt: '',
    url: '/page',
    metaRobots: 'index, follow',
    xRobotsTag: 'noindex',
    userAgent: 'Googlebot',
  });
  assert.equal(result.canIndex, false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL.

- [ ] **Step 3: Create `components/CrawlPolicyResolver/parse.ts`**

Export types:

```ts
type ResolverInput = {
  robotsTxt: string;
  url: string;
  metaRobots: string;
  xRobotsTag: string;
  userAgent: string;
};

type ResolverResult = {
  canCrawl: boolean;
  canIndex: boolean;
  canFollow: boolean;
  conflicts: string[];
  directives: { source: string; directive: string; value: string }[];
};
```

Export `resolvePolicy(input: ResolverInput): ResolverResult`.

The robots.txt parser implements path matching per RFC 9309: longest match wins, specific user-agent rules take precedence over `*`. It handles `Allow` and `Disallow`.

Meta robots and X-Robots-Tag parsing: split on commas, trim, recognize `index`, `noindex`, `follow`, `nofollow`, `none`, `noarchive`, `nosnippet`, `max-snippet:N`. User-agent-specific X-Robots-Tag values (e.g. `googlebot: noindex`) are matched against the selected user agent.

Conflict detection rules:
- robots.txt blocks crawl + meta robots has `noindex`: warn that `noindex` will never be seen.
- robots.txt blocks crawl: warn that the page may still appear in results without a snippet.
- X-Robots-Tag and meta robots both set for the same directive with different values: note which wins (most restrictive).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Create `components/CrawlPolicyResolver/CrawlPolicyResolver.tsx`**

`'use client'` component. Props: label strings from site content.

State: `robotsTxt`, `url`, `metaRobots`, `xRobotsTag` (all strings), `userAgent` (defaults to `'Googlebot'`).

Renders:
- Input form: a `<textarea>` for robots.txt, text inputs for URL/meta/X-Robots-Tag, a `<select>` for user agent (Googlebot, Bingbot, GPTBot, or custom text input).
- Each input has a visible `<label>` and help text.
- Resolves live as the user types (debounced at 150ms with a timeout, not a library).
- Output: a verdict section (definition list: "Can crawl: Yes/No", "Can index: Yes/No", "Links followed: Yes/No") with color + icon for each.
- Conflict warnings below the verdict, each with an icon and explanation.
- Directive breakdown: a table showing each parsed directive, its source and whether it is active.
- Output area has `min-height` reserved.
- Conflict warnings use `role="alert"`.

- [ ] **Step 6: Create `components/CrawlPolicyResolver/CrawlPolicyResolver.module.scss`**

Verdict uses `$theme-accent` for "yes" and `$theme-action` (sand) for "no" (both pass 7:1). Conflict warnings use `$theme-action` background tinted. Input fields: `$theme-inset` background, `$theme-border` border, `$theme-text` text. Help text: `$theme-text-3`, `$fs-label`.

- [ ] **Step 7: Create `app/tools/crawl-policy-resolver/page.tsx` and styles**

Same pattern as previous tools: metadata, canonical, `<h1>`, intro, client component, `SoftwareApplication` JSON-LD.

- [ ] **Step 8: Run `npm run lint && npm run typecheck`**

Expected: PASS.

- [ ] **Step 9: Test in browser**

Open `/tools/crawl-policy-resolver/`. Test cases:
- Empty inputs: open policy, no conflicts.
- `Disallow: /` in robots.txt: "Can crawl: No" with warning.
- `Disallow: /` + `noindex` in meta: conflict warning about meta never being seen.
- `noindex` in meta only: "Can index: No", no conflict.
- Both meta and X-Robots-Tag with different values: most restrictive wins, noted in breakdown.
- 390px mobile width.

- [ ] **Step 10: Commit**

```
git add components/CrawlPolicyResolver/ app/tools/crawl-policy-resolver/ tests/crawl-policy-resolver.test.ts
git commit -m "Add crawl policy conflict resolver tool"
```

---

### Task 7: Sitemap, llms.txt, generateStaticParams and nav integration

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/llms.txt/route.ts`
- Modify: `content/site.ts` (only if `nav` was not updated in Task 1)

**Interfaces:**
- Consumes: `site.tools.items` from Task 1
- Produces: sitemap with tool URLs, llms.txt with tools section, `generateStaticParams` on tool pages

- [ ] **Step 1: Update `app/sitemap.ts`**

Add `/tools/` and each tool page from `site.tools.items.map(item => absoluteUrl(`/tools/${item.slug}/`))`.

- [ ] **Step 2: Add `generateStaticParams` to each tool page**

If using a dynamic `[tool]` route: add `generateStaticParams` that returns `site.tools.items.map(item => ({ tool: item.slug }))`. If each tool is its own directory (the current plan), `generateStaticParams` is not needed since routes are static. Verify this.

- [ ] **Step 3: Update `app/llms.txt/route.ts`**

Add a "Tools" section after "Services":

```ts
`## ${llms.toolsTitle}`,
'',
...site.tools.items.map((tool) => `- [${tool.title}](${absoluteUrl(`/tools/${tool.slug}/`)}): ${tool.description}`),
```

Add `toolsTitle: 'Tools'` to `site.llms` in the content file (if not already added in Task 1).

- [ ] **Step 4: Run `npm run lint && npm run typecheck && npm test`**

Expected: PASS.

- [ ] **Step 5: Run `npm run build` and verify no errors**

The build pre-renders all tool pages. Check the output for `/tools/`, `/tools/rendering-timer/`, `/tools/ai-crawler-policy/`, `/tools/crawl-policy-resolver/`.

- [ ] **Step 6: Verify sitemap and llms.txt**

After build, check `/sitemap.xml` includes the four new URLs. Check `/llms.txt` includes the tools section.

- [ ] **Step 7: Commit**

```
git add app/sitemap.ts app/llms.txt/route.ts content/site.ts
git commit -m "Add tools to sitemap, llms.txt and navigation"
```

---

### Task 8: Final verification

**Files:** None created or modified.

- [ ] **Step 1: Run the full check suite**

```
npm run lint && npm run typecheck && npm test
```

Expected: PASS.

- [ ] **Step 2: Run `npm run build`**

Expected: clean build with no warnings.

- [ ] **Step 3: Run `npm run preview` and test the production build**

Verify in the Workers runtime:
- `/tools/` overview page loads, cards link correctly.
- Each tool page loads and works.
- Rendering timer: start, milestones, complete, reset. `?auto` starts on load.
- AI crawler policy: toggles update output, copy buttons work, tabs switch.
- Crawl policy resolver: inputs produce correct verdicts, conflicts detected.
- Mobile layout (390px) on all pages.
- Footer and cookie consent on all pages.
- JSON-LD on each tool page (check with browser DevTools).
- Navigation: "Tools" in nav, mobile menu, back link to homepage.

- [ ] **Step 4: Run `npm run check:site` against the preview**

```
npm run check:site -- http://localhost:8787
```

Expected: PASS for the existing checks. New tool pages should pass heading hierarchy, skip link, 404 for unknown tool slugs.

- [ ] **Step 5: Run Lighthouse against the preview**

```
npm run check:lighthouse -- http://localhost:8787/tools/rendering-timer/
```

Expected: performance at least 90, accessibility/best practices/SEO 100.
