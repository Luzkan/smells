/**
 * verify-sitemap.mjs — Post-build sitemap verification.
 *
 * Checks that dist/sitemap-0.xml (or sitemap-index.xml) contains:
 * - All 56 article URLs: /smells/{slug}
 * - Catalog page: /
 * - About page: /about
 * - No trailing slashes
 *
 * Usage: node scripts/verify-sitemap.mjs
 * Run after `pnpm build`.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST_DIR = join(ROOT, 'dist');
const CONTENT_DIR = join(ROOT, 'content', 'smells');
const SITE_URL = 'https://codesmells.org';

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function main() {
  // Find the sitemap file
  let sitemapPath = join(DIST_DIR, 'sitemap-0.xml');
  if (!existsSync(sitemapPath)) {
    sitemapPath = join(DIST_DIR, 'sitemap-index.xml');
  }
  if (!existsSync(sitemapPath)) {
    fail('No sitemap file found in dist/. Did you run `pnpm build`?');
    return;
  }

  const sitemapContent = readFileSync(sitemapPath, 'utf-8');

  // If this is a sitemap index, find and read the actual sitemap
  let urls = sitemapContent;
  if (sitemapContent.includes('<sitemapindex')) {
    // Extract referenced sitemap URLs
    const sitemapUrlMatch = sitemapContent.match(/<loc>([^<]+)<\/loc>/g);
    if (sitemapUrlMatch) {
      // Read each referenced sitemap
      urls = '';
      for (const match of sitemapUrlMatch) {
        const url = match.replace(/<\/?loc>/g, '');
        const filename = url.split('/').pop();
        const filePath = join(DIST_DIR, filename);
        if (existsSync(filePath)) {
          urls += readFileSync(filePath, 'utf-8');
        }
      }
    }
  }

  // Get expected slugs from content directory
  const expectedSlugs = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));

  let errors = 0;

  // Check all 56 article URLs
  for (const slug of expectedSlugs) {
    const expectedUrl = `${SITE_URL}/smells/${slug}`;
    if (urls.includes(expectedUrl)) {
      pass(`Article URL found: /smells/${slug}`);
    } else {
      fail(`Article URL missing: /smells/${slug}`);
      errors++;
    }
  }

  // Check catalog page
  // The root URL may appear as just the site URL or with trailing slash
  if (urls.includes(`${SITE_URL}</loc>`) || urls.includes(`${SITE_URL}/</loc>`)) {
    pass('Catalog page URL found: /');
  } else {
    fail('Catalog page URL missing: /');
    errors++;
  }

  // Check about page
  if (urls.includes(`${SITE_URL}/about`)) {
    pass('About page URL found: /about');
  } else {
    fail('About page URL missing: /about');
    errors++;
  }

  // Check no trailing slashes on article URLs
  const trailingSlashPattern = /\/smells\/[a-z-]+\/</g;
  const trailingSlashMatches = urls.match(trailingSlashPattern);
  if (trailingSlashMatches && trailingSlashMatches.length > 0) {
    fail(`Found trailing slashes on article URLs: ${trailingSlashMatches.join(', ')}`);
    errors++;
  } else {
    pass('No trailing slashes found on article URLs');
  }

  // Summary
  console.log('');
  console.log(`Sitemap verification: ${expectedSlugs.length} articles expected, ${errors} errors`);
  if (errors === 0) {
    console.log('All sitemap checks passed.');
  }
}

main();
