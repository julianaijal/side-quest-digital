# Side Quest Digital

The website of [Side Quest Digital](https://side-quest-digital.com), the freelance practice of Julian Aijal: technical SEO, performance and web development, based in Amsterdam.

A one page site built to practise what it preaches: fast, accessible, server rendered and readable by search engines and AI assistants.

## Stack

- [Next.js](https://nextjs.org) (App Router) with TypeScript
- SASS modules with design tokens in `styles/_tokens.scss`
- Hosted on Cloudflare Workers via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
- No UI or animation libraries, no tracking cookies. Motion is CSS only and respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emit |
| `npm test` | Copy rules on the site content |
| `npm run build` | Production build |
| `npm run preview` | Build for Cloudflare and run it locally in the Workers runtime |
| `npm run deploy` | Build for Cloudflare and deploy (needs `wrangler login`) |

## Project structure

```
app/         layout, page, metadata routes (sitemap, robots, llms.txt), icons
components/  one folder per section (Nav, Hero, Services, About, Contact, Footer)
content/     site.ts holds all copy; getSite() is the single entry point
lib/         SEO helpers (site URL, JSON-LD)
styles/      design tokens and layout mixins
tests/       content checks
```

## Content

All visible copy lives in `content/site.ts`. Values in `[brackets]` are placeholders; search for `[` to find them. The plan for moving content to a headless CMS is in `ROADMAP.md`.

## Design

Dark "Nacht 2" theme: sea green neutrals, mint as the brand colour, and sand only for actions and the quest marker. Components use semantic theme roles (`$theme-bg`, `$theme-accent`, …) rather than raw palette colours, and inline SVGs read the same roles as CSS custom properties.

## SEO and AI visibility

- Metadata, Open Graph and Twitter cards
- JSON-LD for `ProfessionalService` and `Person`
- `sitemap.xml`, `robots.txt` (all crawlers welcome) and `llms.txt`, generated from the same content file

## Contributing

Project rules and the git workflow (small commits, Conventional Commits) are in [`AGENTS.md`](AGENTS.md). Open work is tracked in [`ROADMAP.md`](ROADMAP.md).
