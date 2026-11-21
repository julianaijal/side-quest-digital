# Tools Section Design

## Intent

Add a `/tools/` section to Side Quest Digital: a collection of small, client-side web tools that Julian builds and uses day to day. They demonstrate technical expertise to potential clients by existing, not by being promoted. The tools themselves are the content. Each is an indexable page that can rank on its target query. No blog or write-up needed around them; each tool page carries just enough context (what it does, why it matters, how to read the result) for someone landing from search. The word "free" is not used anywhere; the absence of a paywall speaks for itself.

## Goals

- Each tool is genuinely useful for daily SEO/web work, not a demo.
- Tools demonstrate that Julian builds, not just advises.
- Low friction to add a new tool: one directory, one page component, one entry in a registry.
- Consistent look within the Night Reef theme.
- Every tool page is indexable with its own title, description and canonical.
- SEO and Core Web Vitals must be solid: proper meta, structured data, server-rendered intro content, no layout shift from client-side tool hydration, fast LCP.

## Non-goals

- No categories or taxonomy yet. Tags on each tool (as metadata, not as URL structure) so grouping can be added later.
- No user accounts, saved results or server-side processing.
- No separate content hub, blog or newsletter.
- No "free" or promotional language. The tools are presented as professional work, not giveaways.

## Anti-goals

- Half-finished tools that don't work reliably.
- Over-engineered "tool framework" that slows down adding a simple page.
- Tools that require external APIs or heavy server-side compute (keep it runnable on Workers).

## Constraints

- Cloudflare Workers runtime (CPU limits, edge execution).
- Night Reef dark theme, 7:1+ contrast on all text.
- Server components by default; client components only where the tool needs interactivity.
- CSS-only motion wrapped in `prefers-reduced-motion: no-preference`. No UI or animation libraries.
- American English copy lives in `content/site.ts`.
- Baseline Widely available features only; Newly available as progressive enhancement.

## Approaches considered

### A: Flat list with tags (chosen)

`/tools/` overview page lists all tools as cards. Each tool lives at `/tools/<slug>/`. Tools carry a tag (e.g. "Technical SEO") as metadata for future grouping. One shared layout handles navigation back to the main site and the tools overview.

Trade-off: at 20+ tools the flat list may need grouping, but that is a small change (filter/sort the existing tag metadata) and a luxury problem.

### B: Categories in URL structure

`/tools/seo/<slug>`, `/tools/performance/<slug>`. Premature: forces category decisions now, makes URLs longer for no SEO benefit, and categories feel empty with 3–5 tools.

### C: No overview page

Each tool is a standalone page, no index. Loses the "toolkit" presentation to clients and misses the indexable collection page.

## Design

### File structure

```
app/tools/
  layout.tsx          Shared layout (nav bar with link to homepage + tools overview)
  page.tsx            Overview: title, intro, grid of tool cards
  [tool]/
    page.tsx          Individual tool page (the slug comes from the registry)

content/site.ts       Add a `tools` key with section copy + per-tool metadata
```

Each tool is a directory under `app/tools/` whose folder name matches its slug in the registry.

### Tool registry

A `tools` object in `content/site.ts` holds the section-level copy and an array of tool entries:

```ts
tools: {
  meta: {
    title: 'Tools · Side Quest Digital',
    description: 'SEO and web tools built and used by Side Quest Digital.',
  },
  title: 'Tools',
  intro: 'Tools I build and use in my own work.',
  items: [
    {
      slug: 'rendering-timer',
      title: 'Rendering timer',
      description: 'See how much rendering time a browser or search engine spends on a page.',
      tag: 'Technical SEO',
    },
    {
      slug: 'ai-crawler-policy',
      title: 'AI crawler policy generator',
      description: 'Generate robots.txt rules, meta tags and Content Signals for AI crawlers.',
      tag: 'Technical SEO',
    },
    {
      slug: 'crawl-policy-resolver',
      title: 'Crawl policy conflict resolver',
      description: 'Check whether your robots.txt, meta robots and X-Robots-Tag conflict.',
      tag: 'Technical SEO',
    },
  ],
}
```

Adding a new tool: add a directory under `app/tools/`, add an entry to `items`, done.

### Overview page (`/tools/`)

- Shared `<Nav>` from the main site (or a lighter tools variant with a link home).
- Section title and intro.
- Grid of cards, one per tool. Each card shows the title, description and tag. Links to `/tools/<slug>/`.
- Night Reef styling, same card treatment as the services section.

### Shared tools layout

The `app/tools/layout.tsx` wraps every tools page with:

- A top bar with the Side Quest Digital wordmark (links to `/`) and a "Tools" link (to `/tools/`).
- Consistent footer (same as homepage or a lighter variant).
- The page content in a centered container.

The main site nav links to `#services`, `#about`, etc. (anchor links within the one-pager). The tools layout needs its own navigation since tools live on separate routes. Decision for the builder: whether to reuse the existing `<Nav>` component with different items or build a simpler tools-specific header.

### Navigation from the main site

Add a "Tools" entry to `site.nav` that links to `/tools/`. This is a regular link (not an anchor), so it navigates away from the one-pager. The mobile menu close logic must handle navigation links (not just same-page anchors).

The tools section is not referenced on the homepage body: no mention in service cards or teaser blocks. It is reachable through the nav link and direct URLs. The nav link is enough; the tools earn their own traffic through search.

### Sitemap

Add `/tools/` and each tool page to `app/sitemap.ts`.

### Structured data

The root layout's JSON-LD graph (WebSite, Organization, Person) stays on every page, including tools. Each tool page adds a second `<script type="application/ld+json">` with a `SoftwareApplication` node (name, description, url, `applicationCategory: "WebApplication"`, `offers: { price: "0" }`). Cheap to add, keeps the structured data clean.

### Meta per tool page

Each tool page sets its own `metadata` export with title (`{tool title} · Side Quest Digital`), description and canonical. OG images use the site-wide fallback for now; per-tool OG images are a later optimization.

### `llms.txt`

Add the tools section to `llms.txt` so AI assistants see the full picture. Tools are indexable public content.

### Analytics and cookies

Tool pages use the same `Footer` with `CookieConsent` and the same GTM/analytics setup as the rest of the site. Tool interactions (e.g. "Start timer") get `data-track` attributes where meaningful.

### Static generation

All tool pages are fully pre-rendered at build time via `generateStaticParams` from the registry. Unknown slugs return a real 404. This keeps Workers CPU usage minimal and ensures fast LCP.

### CWV considerations

- LCP: the server-rendered intro text and tool heading are the LCP candidates, not the interactive tool UI. This keeps LCP fast regardless of client-side hydration.
- CLS: the tool's interactive area must have a fixed or minimum height reserved in the server render, so inserting milestones or results does not shift content above.
- INP: tool interactions (start button, running timer) must respond within 200 ms. The timer uses `requestAnimationFrame` or `setInterval`, not blocking synchronous loops.

---

## First tool: Rendering Timer

### What it does

A page that progressively renders content at known millisecond intervals. After Googlebot (or any headless browser) visits, you check in Search Console which content was indexed to learn how much rendering time was allocated.

### How it works

1. The page server-renders an intro explaining the tool and a "Start" button.
2. On click, client-side JS starts a timer and progressively inserts milestone markers into the DOM at specific intervals.
3. Each milestone has:
   - A visual indicator (a filled bar segment or checkmark).
   - A human-readable label: "100 ms", "500 ms", "1 s", "2 s", "5 s", "10 s", "15 s", "20 s".
   - A unique, searchable text string: `sqd-render-100`, `sqd-render-500`, etc., so you can do `site:example.com "sqd-render-5000"` in Google to check what was indexed.
4. The timer displays elapsed time in real time (a running counter).
5. After the last milestone (20 s), the timer stops and shows "Complete".

### Intervals

Logarithmic-ish distribution covering the range where rendering budgets typically live:

100 ms, 250 ms, 500 ms, 1 s, 2 s, 3 s, 5 s, 7 s, 10 s, 15 s, 20 s.

### Googlebot mode

For the tool to actually work with Googlebot, there is an `?auto` query parameter that starts the timer on page load without requiring a click. This is the URL you submit to Google for indexing. The default (no param) requires a click so human visitors get context first.

### Accessibility

- The running counter uses `aria-live="off"`. A screen reader does not need to hear every millisecond tick. The final result gets `aria-live="polite"`.
- The milestone list is a simple ordered list with static text once rendered.
- `prefers-reduced-motion`: the running counter still counts but the visual progress bar animation is removed (instant fill, no transition). The tool remains functional.

### Client component boundary

Only the timer component itself (`RenderingTimer`) is a client component. The tool page, its intro text and the layout remain server components.

### Copy

Intro text on the tool page (a few sentences):
- What it is: a timer that renders content at known intervals.
- Why: to test how much rendering time Googlebot or another crawler allocates.
- How to use: add `?auto` to the URL, submit it for indexing, then search for the milestone strings in Google.

This copy lives in `content/site.ts` under the tool's entry.

### What is left to the builder

- Exact visual design of the timer and milestones (within Night Reef tokens).
- Whether the overview page cards get an icon/illustration or just text.
- Whether to reuse `<Nav>` with different items or build a lighter tools header.
- Exact copy wording (the shape is defined here; final phrasing is a writing pass).

---

## Second tool: AI Crawler Policy Generator

### What it does

Generates the complete set of directives for controlling how AI crawlers and search engines interact with your content: robots.txt rules, meta robots tags, HTTP headers and Content Signals (contentsignals.org). There is no standalone tool that combines all four mechanisms yet.

### How it works

1. The page server-renders an intro explaining what Content Signals and AI crawler directives are, plus the form in its default state.
2. The form has three groups of toggles:
   - **Search indexing**: allow search engines to crawl and index (Google, Bing, etc.).
   - **AI search answers**: allow content to appear in AI-generated answers (Google AI Overviews, Bing Chat, etc.).
   - **AI training**: allow content to be used for training AI models.
3. Optionally, the user picks which AI crawlers to address (GPTBot, ClaudeBot, Google-Extended, Bytespider, CCBot, etc.) or uses a "common crawlers" preset.
4. As toggles change, the output updates live with four tabs:
   - **robots.txt**: the `User-agent` / `Disallow` rules.
   - **Meta tags**: `<meta name="robots">` and Content Signals meta.
   - **HTTP headers**: `X-Robots-Tag` and Content Signals headers.
   - **Summary**: plain English explanation of the effective policy.
5. Each output block has a copy button.

### Content Signals spec

The tool follows the Content Signals specification (contentsignals.org). The key directives:
- `search=yes|no`: allow search indexing.
- `ai-input=yes|no`: allow use as input for AI answers.
- `ai-train=yes|no`: allow use for AI model training.

These are expressed as a meta tag, an HTTP header, or in robots.txt. The tool generates all three so the user can pick what fits their setup.

### Known AI crawlers

The tool ships with a built-in list of known AI crawlers and their purpose (search, training, both). This list lives in a data file so it can be updated without changing the component logic. Initial list:

| Crawler | Operator | Purpose |
|---------|----------|---------|
| GPTBot | OpenAI | Training + search |
| ChatGPT-User | OpenAI | Search (live browsing) |
| ClaudeBot | Anthropic | Training |
| Google-Extended | Google | Training (Gemini) |
| Googlebot | Google | Search indexing |
| Bingbot | Microsoft | Search indexing |
| Bytespider | ByteDance | Training |
| CCBot | Common Crawl | Training |
| PerplexityBot | Perplexity | Search |
| Applebot-Extended | Apple | Training (Apple Intelligence) |

### Client component boundary

The form and live output are a client component (`AiCrawlerPolicy`). The intro text, crawler data and layout remain server components. The crawler list is imported as static data.

### Accessibility

- The form uses proper `<fieldset>` and `<legend>` for each toggle group.
- Toggles are `<input type="checkbox">` with visible labels.
- Output updates use `aria-live="polite"` on the active tab panel so screen readers hear the change.
- Tab switching uses `role="tablist"` / `role="tab"` / `role="tabpanel"` with arrow key navigation.

### CWV

- LCP: the server-rendered intro and form headings are the LCP candidates.
- CLS: the output area has a minimum height so toggling options does not shift content.
- INP: toggle changes update state and re-render the output strings, well within 200 ms.

### Copy

Intro text:
- What it is: a generator for AI crawler directives.
- Why: the rules are spread across four different mechanisms and dozens of crawler names. Getting them wrong means your content is used in ways you did not intend.
- How to use: pick what you want to allow, copy the output into your site's configuration.

---

## Third tool: Crawl Policy Conflict Resolver

### What it does

Takes three inputs (robots.txt rules, a meta robots tag and an X-Robots-Tag header) for a specific URL and shows the effective crawl and index policy. It highlights conflicts and explains which rule wins and why.

### Why this is useful

The three mechanisms interact in non-obvious ways:
- robots.txt blocks crawling, but if Google already knows the URL (from a link), it can still appear in search results, but it cannot read the page to check for `noindex`.
- If robots.txt blocks crawling, the meta robots tag is never seen.
- X-Robots-Tag (HTTP header) and meta robots (HTML) have the same effect but come from different places; the most restrictive directive wins when both are present.
- `noindex` in meta robots works only if the crawler can reach the page (robots.txt does not block it).

Most SEO professionals learn these rules by experience. A tool that resolves them instantly saves time and prevents mistakes during audits.

### How it works

1. The page server-renders an intro explaining the three mechanisms and their interaction, plus the input form.
2. Three input fields:
   - **robots.txt rules**: a text area. The user pastes the relevant rules (or their full robots.txt). An optional URL field lets the tool match the right rules.
   - **Meta robots**: a text input for the content attribute value (e.g. `noindex, nofollow`).
   - **X-Robots-Tag**: a text input for the header value (e.g. `googlebot: noindex`).
3. An optional **User-agent** dropdown to resolve per-crawler (defaults to Googlebot).
4. On submit (or live as the user types), the tool shows:
   - **Effective policy**: a clear verdict. "This page can / cannot be crawled. This page can / cannot be indexed. Links will / will not be followed."
   - **Conflict warnings**: e.g. "robots.txt blocks crawling, so the meta robots `noindex` will never be seen by the crawler. The page may still appear in search results without a snippet."
   - **Rule-by-rule breakdown**: each input parsed into its directives, with which rule wins highlighted.

### Parsing

The tool parses robots.txt rules against the URL using the standard matching algorithm (RFC 9309). Meta robots and X-Robots-Tag values are parsed into their individual directives (`index`, `noindex`, `follow`, `nofollow`, `none`, `noarchive`, `nosnippet`, `max-snippet`, etc.).

### Client component boundary

The form, parser and output are a client component (`CrawlPolicyResolver`). The robots.txt parser is a pure function (no DOM needed) that could be extracted as a utility. The intro text and layout remain server components.

### Accessibility

- Input fields have visible labels and help text explaining the expected format.
- The verdict uses semantic markup: a definition list for the effective policy.
- Conflict warnings use `role="alert"` so they are announced immediately.
- Color is not the only way conflicts are communicated. Icons and text labels accompany color coding.

### CWV

- LCP: server-rendered intro text.
- CLS: output area has a minimum height reserved.
- INP: parsing is synchronous string processing, well within 200 ms even for large robots.txt files.

### Copy

Intro text:
- What it is: a resolver that shows the effective crawl and index policy from your three sets of directives.
- Why: robots.txt, meta robots and X-Robots-Tag interact in ways that catch even experienced SEOs off guard. Getting it wrong means pages are indexed that should not be, or blocked from indexing by accident.
- How to use: paste your directives, pick a crawler, and see the effective policy with any conflicts explained.
