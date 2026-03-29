import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { THEME_COLOR_DARK, THEME_COLOR_LIGHT } from '../../../src/lib/theme-contract';

const distIndex = resolve(__dirname, '../../../dist/index.html');
const distMagicNumber = resolve(__dirname, '../../../dist/smells/magic-number/index.html');
const distOgDir = resolve(__dirname, '../../../dist/og');
const distDefaultOg = resolve(__dirname, '../../../dist/og/default.png');
const distFaviconSvg = resolve(__dirname, '../../../dist/favicon.svg');
const distFaviconIco = resolve(__dirname, '../../../dist/favicon.ico');
const distAppleTouchIcon = resolve(__dirname, '../../../dist/apple-touch-icon.png');
const distSw = resolve(__dirname, '../../../dist/sw.js');
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readBuiltPage(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`${filePath} not found. Run \`pnpm build\` before running build-output tests.`);
  }

  const html = readFileSync(filePath, 'utf-8');
  const headMatch = /<head[^>]*>([\s\S]*?)<\/head>/.exec(html);

  if (!headMatch) {
    throw new Error(`${filePath} does not contain a <head> element.`);
  }

  return { html, head: headMatch[1] };
}

function extractArticleProse(html: string): string {
  const proseStart = html.indexOf('<div class="article-prose">');
  const problemsStart = html.indexOf('<section class="problem-cards"', proseStart);

  if (proseStart === -1 || problemsStart === -1) {
    throw new Error('Could not isolate article prose before the Problems section.');
  }

  return html.slice(proseStart, problemsStart);
}

function expectFontPreload(head: string, fileStem: string) {
  const fontLinkPattern = new RegExp(
    String.raw`<link[^>]*href="[^"]*${fileStem}[^"]*\.woff2"[^>]*>`,
    'i',
  );
  const match = fontLinkPattern.exec(head);

  expect(match, `Expected preload link for ${fileStem}`).toBeTruthy();

  const tag = match![0];
  expect(tag).toContain('rel="preload"');
  expect(tag).toContain('as="font"');
  expect(tag).toContain('type="font/woff2"');
  expect(tag).toContain('crossorigin');
}

function expectThemeColorFallbackMeta(head: string) {
  expect(head).toContain(
    `name="theme-color" content="${THEME_COLOR_LIGHT}" media="(prefers-color-scheme: light)" data-theme-color-fallback="light"`,
  );
  expect(head).toContain(
    `name="theme-color" content="${THEME_COLOR_DARK}" media="(prefers-color-scheme: dark)" data-theme-color-fallback="dark"`,
  );
}

describe('Build output: index.html', () => {
  let html: string;
  let head: string;

  beforeAll(() => {
    ({ html, head } = readBuiltPage(distIndex));
  });

  it('has theme script before stylesheets in <head>', () => {
    const themeScriptPos = head.indexOf('data-theme');
    const stylesheetPos = head.indexOf('rel="stylesheet"');

    // Theme script (containing data-theme) should appear before first stylesheet
    // If there are no stylesheet links, the theme script just needs to exist.
    expect(themeScriptPos).toBeGreaterThan(-1);
    if (stylesheetPos > -1) {
      expect(themeScriptPos).toBeLessThan(stylesheetPos);
    }
  });

  it('bootstraps root theme presentation in the blocking head script', () => {
    expect(head).toMatch(/backgroundColor\s*=\s*getThemeColor\(theme\)/);
    expect(head).toMatch(/colorScheme\s*=\s*theme/);
  });

  it('locks initial transitions until the first page load completes', () => {
    expect(head).toContain('data-initial-transitions');
    expect(head).toMatch(/setAttribute\(\s*initialTransitionLockAttribute/);
    expect(head).toMatch(/removeAttribute\(initialTransitionLockAttribute\)/);
  });

  it('does not hardcode the GA external script in the initial HTML', () => {
    expect(head).not.toContain('https://www.googletagmanager.com/gtag/js');
    expect(head).not.toContain("gtag('config'");
  });

  it('preloads the critical Latin font subsets', () => {
    expectFontPreload(head, 'fraunces-latin-wght-normal');
    expectFontPreload(head, 'plus-jakarta-sans-latin-wght-normal');
  });

  it('#smells-data JSON block exists', () => {
    expect(html).toContain('id="smells-data"');
    expect(html).toContain('type="application/json"');
  });

  it('every .smell-card has data-slug attribute', () => {
    const cardMatches = html.match(/class="smell-card"/g);
    const slugMatches = html.match(/data-slug="/g);

    expect(cardMatches).toBeTruthy();
    expect(slugMatches).toBeTruthy();
    // At least as many data-slug occurrences as smell-card occurrences
    expect(slugMatches!.length).toBeGreaterThanOrEqual(cardMatches!.length);
  });

  it('#filter-results-live exists with correct ARIA attributes', () => {
    expect(html).toContain('id="filter-results-live"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it('has 56 smell cards', () => {
    const cardMatches = html.match(/class="smell-card"/g);
    expect(cardMatches).toBeTruthy();
    expect(cardMatches!.length).toBe(56);
  });

  it('every .smell-card has data-obstruction attribute', () => {
    const cardMatches = html.match(/class="smell-card"/g);
    const obstructionMatches = html.match(/data-obstruction="/g);
    expect(cardMatches).toBeTruthy();
    expect(obstructionMatches).toBeTruthy();
    expect(obstructionMatches!.length).toBeGreaterThanOrEqual(cardMatches!.length);
  });

  it('#category-groups-data JSON block exists', () => {
    expect(html).toContain('id="category-groups-data"');
  });

  it('grid toolbar elements exist', () => {
    expect(html).toContain('id="grid"');
    expect(html).toContain('id="sort-alpha"');
    expect(html).toContain('id="sort-category"');
    expect(html).toContain('id="view-grid"');
    expect(html).toContain('id="view-list"');
  });

  it('includes favicon, manifest, and fallback theme metadata', () => {
    expect(head).toContain('rel="icon" href="/favicon.ico" sizes="32x32"');
    expect(head).toContain('rel="icon" href="/favicon.svg" type="image/svg+xml"');
    expect(head).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    expect(head).toContain('rel="manifest" href="/site.webmanifest"');
    expectThemeColorFallbackMeta(head);
  });

  it('includes OG image metadata hints', () => {
    expect(head).toContain('property="og:image:width" content="1200"');
    expect(head).toContain('property="og:image:height" content="630"');
    expect(head).toContain('property="og:locale" content="en_US"');
  });

  it('includes social image alt text and attribution without article metadata', () => {
    expect(head).toContain('property="og:image:alt" content="Code Smells Catalog"');
    expect(head).toContain('name="twitter:image:alt" content="Code Smells Catalog"');
    expect(head).toContain('name="twitter:site" content="@luzkanz"');
    expect(head).toContain('name="twitter:creator" content="@luzkanz"');
    expect(head).not.toContain('property="article:modified_time"');
  });

  it('uses LinkedIn for author identity and links to the current personal website', () => {
    expect(html).toContain('https://www.linkedin.com/in/luzkan/');
    expect(html).toContain('https://luzkan.com');
    expect(html).not.toContain('https://luzkan.github.io');
  });

  it('does not include the dead thesis footer link', () => {
    expect(html).not.toContain("Master's Thesis");
  });

  it('renders the mobile footer trust-chip title with the resolved smell count', () => {
    expect(html).not.toContain('Browse all {allSmells.length} smells');
    expect(html).toMatch(/class="trust-chip"[^>]*title="Browse all \d+ smells"/);
  });

  it('renders the mobile nav sheet closed and inert by default', () => {
    expect(html).toMatch(/id="mobile-nav-overlay"[^>]*aria-hidden="true"/);
    expect(html).toMatch(/id="mobile-nav-sheet"[^>]*aria-hidden="true"[^>]*inert/);
  });

  it('includes generated OG and favicon assets in dist', () => {
    expect(existsSync(distOgDir)).toBe(true);
    expect(existsSync(distDefaultOg)).toBe(true);
    expect(existsSync(distFaviconSvg)).toBe(true);
    expect(existsSync(distFaviconIco)).toBe(true);
    expect(existsSync(distAppleTouchIcon)).toBe(true);

    const ogFiles = readdirSync(distOgDir).filter((file) => file.endsWith('.png'));
    expect(ogFiles.length).toBeGreaterThanOrEqual(57);

    const defaultOg = readFileSync(distDefaultOg);
    expect(new Uint8Array(defaultOg.subarray(0, PNG_SIGNATURE.length))).toEqual(
      new Uint8Array(PNG_SIGNATURE),
    );
  });

  it('includes the service worker kill switch in dist', () => {
    expect(existsSync(distSw)).toBe(true);

    const sw = readFileSync(distSw, 'utf-8');
    expect(sw).toContain("self.addEventListener('install', () => self.skipWaiting());");
    expect(sw).toContain('clients.forEach((client) => client.navigate(client.url));');
    expect(sw).toContain('self.registration.unregister();');
  });
});

describe('Build output: article page', () => {
  let html: string;
  let head: string;
  let prose: string;

  beforeAll(() => {
    ({ html, head } = readBuiltPage(distMagicNumber));
    prose = extractArticleProse(html);
  });

  it('includes article-specific social metadata', () => {
    expect(head).toContain('property="og:image:alt" content="Magic Number — Code Smells Catalog"');
    expect(head).toContain('name="twitter:image:alt" content="Magic Number — Code Smells Catalog"');
    expect(head).toContain('property="article:modified_time"');
    expect(head).toContain('name="twitter:site" content="@luzkanz"');
    expect(head).toContain('name="twitter:creator" content="@luzkanz"');
  });

  it('includes fallback theme metadata shared by BaseLayout', () => {
    expectThemeColorFallbackMeta(head);
  });

  it('uses LinkedIn for the footer author link without leaking the old personal URL', () => {
    expect(html).toContain('https://www.linkedin.com/in/luzkan/');
    expect(html).not.toContain('https://luzkan.github.io');
  });

  it('renders one example surface without leaking raw example blocks into article prose', () => {
    expect(prose).not.toContain('class="example-block"');
    expect(html).toContain('class="article-section-heading" id="example"');
    expect(html).toContain('class="code-example"');
  });
});
