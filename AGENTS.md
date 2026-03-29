# Code Smells Catalog

## What This Is

A comprehensive catalog of **56 code smells** — structured, browsable reference for developers and researchers. Companion artifact to a Springer Nature research paper and Master's thesis by Marcel Jerzyk.

- **Live at**: https://codesmells.org (Vercel)
- **Legacy URL**: https://luzkan.github.io/smells (redirects to codesmells.org)
- **Google ranking**: #1 for "code smells catalog" — SEO preservation is critical
- **License**: MIT

## Tech Stack

| Layer               | Technology                 | Version  | Notes                                                                |
| ------------------- | -------------------------- | -------- | -------------------------------------------------------------------- |
| Framework           | Astro                      | 5.x      | Content collections via glob loader, static output                   |
| Islands             | Preact                     | 10.x     | Only for FilterSidebar, CodeExample (~4KB gzipped)                   |
| Shared State        | Nano Stores                | latest   | `@nanostores/preact` for islands, vanilla subscriber for static HTML |
| Styling             | Tailwind CSS               | 4.x      | Via `@tailwindcss/vite` plugin (not `@astrojs/tailwind`)             |
| Fonts               | Fontsource                 | latest   | Self-hosted Fraunces, Plus Jakarta Sans, JetBrains Mono              |
| Syntax Highlighting | Shiki                      | built-in | Dual-theme: github-light / github-dark                               |
| Deployment          | Vercel                     | —        | Static output, no adapter. Preview deploys on PRs                    |
| View Transitions    | Astro `<ClientRouter />`   | —        | Crossfade default                                                    |
| Analytics           | GA4 + Vercel Web Analytics | —        | GA4 via `PUBLIC_GA_TRACKING_ID`, consent-gated                       |
| Testing             | Vitest + Playwright        | latest   | Unit, integration, E2E (6-browser matrix on main)                    |

## Repository Map

```
content/smells/           # 56 markdown articles (the primary asset — framework-agnostic)
src/
  components/             # Astro components + Preact islands
    islands/              #   FilterSidebar, CodeExample (Preact, client-hydrated)
    icons/                #   SVG icon components
    seo/                  #   SEOHead, JsonLd
    engagement/           #   ShareButton, CitePanel, FeedbackButton
  layouts/                # BaseLayout, CatalogLayout, ArticleLayout
  pages/                  # File-based routing (index, about, 404, smells/[slug], rss.xml)
  lib/                    # Shared utilities
    catalog/              #   Filter engine, card visibility, search, sorting, URL state
    content/              #   Article parsing, smell utilities, description extraction
    404/                  #   Fuzzy match, diagnoses
  stores/                 # Nano Stores (filters, search, smells-data, derived stores)
  plugins/                # Remark plugins (smell links, strip sections, callouts, overview heading)
  schemas/                # Zod schema for smell frontmatter
  styles/                 # Global CSS, fonts
scripts/                  # Build helpers (OG image generation, GH Pages redirects, sitemap verification)
tests/
  unit/                   # Vitest: schema validation, filter engine, utilities
  integration/            # Vitest: remark plugin pipeline
  e2e/                    # Playwright: smoke, a11y, catalog filter, theme toggle, view transitions
public/                   # Static assets (favicons, robots.txt, SW kill switch, manifest)
data_scraper/             # Python tool — parses markdown into JSON for research (independent)
.github/workflows/        # CI (lint, test, build, bundle size, E2E), deploy (kill switch, redirects), E2E preview
.cursor/rules/            # Agent context rules
docs/                     # Changelogs, checklists, migration archive
```

## Content Model

Each smell is a `.md` file in `content/smells/` with YAML frontmatter:

- **slug** — kebab-case identifier, matches filename
- **meta** — title, last_update_date, cover image, known_as (aliases)
- **categories** — classified along 5 dimensions:
  - _expanse_: Within | Between
  - _obstruction_: Bloaters, Change Preventers, Couplers, Data Dealers, Dispensables, Functional Abusers, Lexical Abusers, Obfuscators, Object Oriented Abusers, Other
  - _occurrence_: Duplication, Responsibility, Measured Smells, Data, Unnecessary Complexity, Interfaces, Names, Message Calls, Conditional Logic
  - _smell_hierarchies_: Antipattern, Architecture Smell, Code Smell, Design Smell, Implementation Smell, Linguistic Antipattern, Linguistic Smell
  - _tags_: Major | Minor (uses `---` as null placeholder)
- **relations** — links to other smells with typed relationships: causes, caused, co-exist, family, antagonistic
- **problems** — general issues + violated principles/patterns (rendered via ProblemCards)
- **refactors** — applicable refactoring techniques (rendered via RefactoringList)
- **history** — academic provenance (author, year, source type, ISBN/URL)

Convention: `---` is used as a null/empty placeholder in YAML arrays, filtered out by the Zod schema.

For the full frontmatter schema, see `.cursor/rules/content-model.mdc`.

## Routing

| Route            | File                            | Description                                  |
| ---------------- | ------------------------------- | -------------------------------------------- |
| `/`              | `src/pages/index.astro`         | Catalog with hero, filter sidebar, card grid |
| `/smells/[slug]` | `src/pages/smells/[slug].astro` | Individual smell article (56 pages)          |
| `/about`         | `src/pages/about.astro`         | About page                                   |
| `/rss.xml`       | `src/pages/rss.xml.ts`          | RSS feed                                     |
| Custom 404       | `src/pages/404.astro`           | 404 with fuzzy matching and diagnoses        |

## Icons

Use `src/lib/icon-paths.ts` (`ICON_*` with `Icon.astro` or `Icon.tsx`) when a glyph is shared with Preact islands or reused across files; use `src/components/icons/*Icon.astro` for Astro-only named icons; reserve inline `<svg>` for rare one-offs (see the `icon-paths.ts` file comment).

## Islands Architecture

Most pages ship **zero framework JavaScript**. Preact is used only for interactive components:

| Component     | Hydration        | Location                               |
| ------------- | ---------------- | -------------------------------------- |
| FilterSidebar | `client:load`    | Catalog page — filter/search/sort      |
| CodeExample   | `client:visible` | Article pages — smelly/solution toggle |

Everything else uses **inline `<script>` tags** in Astro components:

- ThemeToggle, Nav scroll, ToC scroll spy, card visibility (Nano Store subscriber), Footer citation copy, 404 fuzzy search, analytics consent

## Deployment

- **Primary**: Vercel (static output, auto-detects Astro, preview deploys on PRs)
- **Domain**: codesmells.org
- **Legacy redirect**: GitHub Pages at `luzkan.github.io/smells` serves HTML meta-refresh redirects to codesmells.org
- **CI**: `.github/workflows/ci.yml` — lint, unit test, build (verifies 56 pages + RSS + sitemap), bundle size, E2E
- **Preview E2E**: `.github/workflows/e2e-preview.yml` — smoke tests on Vercel preview deploys

For deployment details, see `.cursor/rules/deployment.mdc`.

## Constraints

- **Content files are sacred**: do not modify frontmatter schema without explicit instruction
- **SEO must be preserved**: #1 Google ranking, canonical URLs, redirects from old GitHub Pages URLs
- **Python data scraper is independent**: reads the same markdown files, unaffected by frontend
- **Internal links**: smell articles link to each other via `./slug.md` — transformed by `src/plugins/remark-smell-links.ts`

## Cursor Rules

For deeper context, see `.cursor/rules/`:

- `project-context.mdc` — always-on orientation (constraints, key directories)
- `content-model.mdc` — full frontmatter schema (activates on `content/**`)
- `architecture.mdc` — Astro architecture, component patterns, island strategy
- `deployment.mdc` — CI/CD, Vercel, GitHub Pages redirects, SEO
