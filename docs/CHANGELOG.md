# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [`2.0.1`] - 2026-03-29

**Users can now quiet animations without touching their OS settings.** A sparkles toggle in the nav gives per-site control, persisted across sessions.

### Added

- **Animation toggle** — sparkles button in the nav lets users reduce motion on this site alone. Bounces when sparkles come back to life; goes instantly quiet when they don't.
- **Tooltip system** for nav icon buttons — CSS-only `data-tooltip` with arrow, hover delay, and keyboard focus support, replacing native `title` attributes
- **Motion contract** (`motion-contract.ts`) — shared constants and types mirroring the theme system architecture
- **Motion preference blocking script** — resolves `html[data-motion]` before first paint (localStorage first, OS `prefers-reduced-motion` as fallback), stamps new documents on view transitions

### Changed

- Motion system rewired from fifteen independent `@media (prefers-reduced-motion)` blocks to one `html[data-motion]` attribute driving a global CSS kill switch — near-zero durations on all transitions, animations, and view transitions when reduced
- Mobile nav hardened against view-transition DOM replacement: lazy element lookups, re-bound listeners on `astro:page-load`, duplicate-event guards via data attributes
- E2E test helpers extracted for consent flow, catalog filter scoping, and stable click-with-scroll patterns; clipboard tests skip non-Chromium; force-click fallbacks for mobile viewports

### Fixed

- Horizontal overflow from `left: -100vw; right: -100vw` on full-bleed decorative backgrounds in CatalogHero and ArticleLayout — replaced with `translateX(-50%)` centering
- ThemeToggle spin animation clipping tooltip pseudo-elements — now targets inner icons instead of the button, `overflow: hidden` dropped

---

## [`2.0.0`] - 2026-03-23

**Complete rewrite — Gatsby → Astro 5.** New architecture, new design, same 56 smells.

### Architecture

- Migrated from Gatsby (React, Material UI) to **Astro 5** with static output
- Adopted **Preact islands** for interactive components (FilterSidebar, CodeExample) — most pages ship zero framework JS
- Replaced client-side state with **Nano Stores** (shared between islands and vanilla scripts)
- Switched styling from Material UI to **Tailwind CSS v4** (via `@tailwindcss/vite`)
- Self-hosted fonts via **Fontsource** (Fraunces, Plus Jakarta Sans, JetBrains Mono)
- Content collections powered by Astro's glob loader with **Zod schema validation**
- Custom **remark plugin pipeline** for smell cross-links, callout sections, and section extraction
- View Transitions via Astro `<ClientRouter />` with lifecycle cleanup helpers

### Added

- **Catalog page**: filterable/searchable card grid with 5-dimension faceted filtering, URL hash state persistence, and keyboard navigation
- **Article pages**: structured layout with table of contents, scroll spy, problem cards, refactoring list, code examples (smelly/clean toggle with compare mode), engagement bar (share, cite, feedback), prev/next navigation, and related smells
- **Dark mode**: system-preference-aware with manual toggle, no FOUC (blocking inline script)
- **SEO**: per-page Open Graph images, Twitter Cards, JSON-LD structured data for catalog, article, and about pages, canonical URLs, XML sitemap with CI verification, RSS feed
- **Custom 404**: fuzzy slug matching with Levenshtein distance, humorous diagnoses, and suggested navigation
- **About page**: origin story, taxonomy breakdown, anatomy walkthrough, research citations, and contributor acknowledgements
- **Accessibility**: skip navigation, semantic landmarks, `aria-expanded`/`aria-hidden`/`inert` on interactive panels, axe-core E2E tests, keyboard navigation tests, reduced-motion support, print styles
- **Analytics**: GA4 (consent-gated) and Vercel Web Analytics (production-only)
- **Service worker kill switch** to unregister legacy Gatsby SW on returning visitors
- **GitHub Pages redirect layer**: HTML meta-refresh redirects from `luzkan.github.io/smells` to `codesmells.org`
- **CI pipeline**: ESLint + Prettier, Astro type-check, Vitest (unit + integration), build verification (56 pages, RSS, sitemap), bundle size budget (see `.size-limit.json`), Playwright E2E (6-browser matrix on main)
- **OG image generation** script for all 56 smell articles
- **Dependabot** for automated dependency updates

### Changed

- Deployment target moved from GitHub Pages to **Vercel** (static)
- Domain changed from `luzkan.github.io/smells` to **`codesmells.org`** (with 301 redirects)
- URL structure changed from `/smells/{slug}` hash-based to clean `/smells/{slug}` paths
- Content frontmatter schema extended with `smell_hierarchies` dimension, typed relations, and structured `history` entries
- All 56 smell articles updated with enriched metadata and consistent formatting

### Removed

- Gatsby, React, Material UI, and all associated dependencies
- Client-side-only routing (replaced with static HTML + View Transitions)
- GitVersioniser workflow (replaced with standard CI)

---

## [[`1.0.23-alpha.1`]] - 2023-10-16

### Documentation

- Create LICENSE (#19)

## [[`1.0.22`]] - 2023-03-28

### Documentation

- Added missing links in README.md
- Added link to Springer Paper

### Changed

- Added link to Springer Paper in footer and header

## [[`1.0.21`]] - 2022-09-02

### Typo

- Added missing double underscore in `__getitem__` in Clever Code

### Fixed

- Links to "Imperative Loops" article were adjusted

## [[`1.0.20`]] - 2022-09-02

### Typo

- Added missing source to MF1999 for Global Data (#13) #patch

## [[`1.0.19`]] - 2022-09-02

### Typo

- Retrieving Type Signature instead of Objects in Fallacious Method Name

### Documentation

- Updated Example of retrieving Foos in Fallacious Method Name

## [[`1.0.18`]] - 2022-09-02

### Typo

- Martin Fowler's name (Marin - Martin) #patch

## [[`1.0.17`]] - 2022-08-28

### Documentation

- Correct spelling of link to Martin Fowler's article. #patch

## [[`1.0.16-alpha.1`]] - 2022-08-28

### Continuous Integration

- Created a GitVersioniser Preview Action
- Removed duplicate linter jobs ran on Merge Requests #patch

### Merge Branches

- request #7 from Luzkan/ci/gitversioniser-preview-changes

## [[`1.0.14`]] - 2022-08-22

### Other

- fix spelling

### Merge Branches

- request #4 from rruiter87/patch-1

### Typo

- Fowler name in Alternative Classes with Different Interfaces #patch

## [[`1.0.12`]] - 2022-08-21

### Other

- Update binary-operator-in-name.md

### Merge Branches

- request #3 from calypsow777/patch-1

### Typo

- fix(binary-operator-in-name.md): correct typo #patch

## [[`1.0.10`]] - 2022-08-15

### Architecture

- Data Scraper directory is now named [`data_scraper`](../data_scraper/) instead of `data`.

### Documentation

- Updated [`README.md`](../README.md) with new directory. #patch

## [[`1.0.9`]] - 2022-08-14

### Continuous Integration

- Added [GitVersioniser](../.github/workflows/GitVersioniser.yml).
- Renamed linter files
- Grouped the `misc-linters` and `frontend-linters` into [`Linters.yml`](../.github/workflows/Linters.yml)

## [[1.0.7]] - 2022-08-13

### Changed

- Made the card headings [clickable](../src/views/catalog/content/cards-container/card/components/SmellCardContent.tsx).

### Removed

- [Disabled](../src/views/catalog/content/cards-container/card/index.tsx) confusing green and red badges (doing some work on dead code and speculative generality over here).

## [[1.0.6]] - 2022-08-13

### Added

- Added the [Paper](./paper.pdf)
- Added the [Master Thesis](./thesis.pdf)

## [[1.0.5]] - 2022-04-19

### Changed

- Language tweaks in all of the Code Smells contents.
- [Reload on First Visit](../src/utils/reloadPageOnFirstVisit.ts) now will reload the page on first visit each day.

## [[1.0.4]] - 2022-04-13

### Added

- [Insider Trading](../content/smells/insider-trading.md) new _Hierarchy_: **Design Smell**

### Changed

- [Type Embedded In Name](../content/smells/type-embedded-in-name.md) _Obstruction_ category: **Lexical Abusers** to **Couplers**

### Fixed

- Lack of navigation item for **Lexical Abusers** category in _Obstruction_.

## [[1.0.3]] - 2022-04-12

### Changed

- Language Tweaks in Smells content

### Removed

- Old, leftover _to-do_ in [Occurrences](../src/model/Occurrences.tsx) regarding icon

## [[1.0.2]] - 2022-04-08

### Changed

- Website Description
- Icons for:
  - Obstruction:
    - Other
  - Occurrence:
    - Responsibility
    - Unnecessary Complexity
  - Smell Hierarchies:
    - Linguistic Smell

## [[1.0.1]] - 2022-04-04

**Migrated from [Material v4](https://v4.mui.com/) to [Material v5](https://mui.com/)**

### Fixed

- [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) by [force-reloading](../src/utils/reloadPageOnFirstVisit.ts) page on first visit (only on the Catalog page).

## [[1.0.0]] - 2022-04-03

**Project Published**

### Added

- **Code Smells**:
  - [Afraid to Fail](../content/smells/afraid-to-fail.md)
  - [Alternative Classes with Different Interfaces](../content/smells/alternative-classes-with-different-interfaces.md)
  - [Base Class Depends on Subclass](../content/smells/base-class-depends-on-subclass.md)
  - [Binary Operator in Name](../content/smells/binary-operator-in-name.md)
  - [Boolean Blindness](../content/smells/boolean-blindness.md)
  - [Callback Hell](../content/smells/callback-hell.md)
  - [Clever Code](../content/smells/clever-code.md)
  - [Combinatorial Explosion](../content/smells/combinatorial-explosion.md)
  - [Complicated Boolean Expression](../content/smells/complicated-boolean-expression.md)
  - [Complicated Regex Expression](../content/smells/complicated-regex-expression.md)
  - [Conditional Complexity](../content/smells/conditional-complexity.md)
  - [Data Clump](../content/smells/data-clump.md)
  - [Dead Code](../content/smells/dead-code.md)
  - [Divergent Change](../content/smells/divergent-change.md)
  - [Dubious Abstraction](../content/smells/dubious-abstraction.md)
  - [Duplicated Code](../content/smells/duplicated-code.md)
  - [Fallacious Comment](../content/smells/fallacious-comment.md)
  - [Fallacious Method Name](../content/smells/fallacious-method-name.md)
  - [Fate Over Action](../content/smells/fate-over-action.md)
  - [Feature Envy](../content/smells/feature-envy.md)
  - [Flag Argument](../content/smells/flag-argument.md)
  - [Global Data](../content/smells/global-data.md)
  - [Hidden Dependencies](../content/smells/hidden-dependencies.md)
  - [Imperative Loops](../content/smells/imperative-loops.md)
  - [Inappropriate Static](../content/smells/inappropriate-static.md)
  - [Incomplete Library Class](../content/smells/incomplete-library-class.md)
  - [Inconsistent Names](../content/smells/inconsistent-names.md)
  - [Inconsistent Style](../content/smells/inconsistent-style.md)
  - [Indecent Exposure](../content/smells/indecent-exposure.md)
  - [Insider Trading](../content/smells/insider-trading.md)
  - [Large Class](../content/smells/large-class.md)
  - [Lazy Element](../content/smells/lazy-element.md)
  - [Long Method](../content/smells/long-method.md)
  - [Long Parameter List](../content/smells/long-parameter-list.md)
  - [Magic Number](../content/smells/magic-number.md)
  - [Message Chain](../content/smells/message-chain.md)
  - [Middle Man](../content/smells/middle-man.md)
  - [Mutable Data](../content/smells/mutable-data.md)
  - [Null Check](../content/smells/null-check.md)
  - [Obscured Intent](../content/smells/obscured-intent.md)
  - [Oddball Solution](../content/smells/oddball-solution.md)
  - [Parallel Inheritance Hierarchies](../content/smells/parallel-inheritance-hierarchies.md)
  - [Primitive Obsession](../content/smells/primitive-obsession.md)
  - [Refused Bequest](../content/smells/refused-bequest.md)
  - [Required Setup or Teardown Code](../content/smells/required-setup-or-teardown-code.md)
  - [Shotgun Surgery](../content/smells/shotgun-surgery.md)
  - [Side Effects](../content/smells/side-effects.md)
  - [Special Case](../content/smells/special-case.md)
  - [Speculative Generality](../content/smells/speculative-generality.md)
  - [Status Variable](../content/smells/status-variable.md)
  - [Temporary Field](../content/smells/temporary-field.md)
  - [Tramp Data](../content/smells/tramp-data.md)
  - [Type Embedded In Name](../content/smells/type-embedded-in-name.md)
  - [Uncommunicative Name](../content/smells/uncommunicative-name.md)
  - [Vertical Separation](../content/smells/vertical-separation.md)
  - ["What" Comment](../content/smells/what-comment.md)
- **Documentation**:
  - [`README.md`](../README.md)
  - [`CHANGELOG.md`](CHANGELOG.md)
- **Data Scraping Scripts** (Python) to parse contents of [`/content/smells/`](../content/smells/) into `.json` files. They main method is located in [`/data_scraper/main.py`](../data_scraper/main.py) and can be run via `python main.py`. The only package requirement can be installed via `python -m pip install` [`python-frontmatter`](https://pypi.org/project/python-frontmatter/).
- **Website**:
  - Homepage with catalog for all the smells from [`/content/smells/`](../content/smells/) displayed as cards. They can be clicked on to show up a modal dialog with all the available information.
  - The homepage has a filter sidebar for easier browsing. Smells can be filtered by the categorization types (_occurrence_, _expanse_, _obstruction_, _type_of_smell_, _tags_)
  - Separate page articles for each smell, so they can be directly linked to by anyone for any reason.
  - Separate page articles navigation bar on the left to browse to other smells. This navigation bar can be turned to list by a different type of categorization types.

[1.0.0]: https://github.com/Luzkan/smells/releases/tag/1.0.0
[1.0.1]: https://github.com/Luzkan/smells/releases/tag/1.0.1
[1.0.2]: https://github.com/Luzkan/smells/releases/tag/1.0.2
[1.0.3]: https://github.com/Luzkan/smells/releases/tag/1.0.3
[1.0.4]: https://github.com/Luzkan/smells/releases/tag/1.0.4
[1.0.5]: https://github.com/Luzkan/smells/releases/tag/1.0.5
[1.0.6]: https://github.com/Luzkan/smells/releases/tag/1.0.6
[1.0.7]: https://github.com/Luzkan/smells/releases/tag/1.0.7
[`1.0.9`]: https://github.com/Luzkan/smells/releases/tag/1.0.9
[`1.0.10`]: https://github.com/Luzkan/smells/releases/tag/1.0.10
[`1.0.12`]: https://github.com/Luzkan/smells/releases/tag/1.0.12
[`1.0.14`]: https://github.com/Luzkan/smells/releases/tag/1.0.14
[`1.0.16-alpha.1`]: https://github.com/Luzkan/smells/releases/tag/1.0.16-alpha.1
[`1.0.17`]: https://github.com/Luzkan/smells/releases/tag/1.0.17
[`1.0.18`]: https://github.com/Luzkan/smells/releases/tag/1.0.18
[`1.0.19`]: https://github.com/Luzkan/smells/releases/tag/1.0.19
[`1.0.20`]: https://github.com/Luzkan/smells/releases/tag/1.0.20
[`1.0.21`]: https://github.com/Luzkan/smells/releases/tag/1.0.21
[`1.0.22`]: https://github.com/Luzkan/smells/releases/tag/1.0.22
[`2.0.1`]: https://github.com/Luzkan/smells/releases/tag/2.0.1
[`2.0.0`]: https://github.com/Luzkan/smells/releases/tag/2.0.0
[`1.0.23-alpha.1`]: https://github.com/Luzkan/smells/releases/tag/1.0.23-alpha.1
