/**
 * generate-gh-pages-redirects.mjs — Generates GitHub Pages cutover artifacts.
 *
 * Output:
 * - HTML redirect pages for the legacy `luzkan.github.io/smells/*` URLs
 * - A real compatibility `rss.xml` so existing subscribers keep working
 * - The service worker kill switch at `/smells/sw.js`
 *
 * Output directory: gh-pages-redirects/
 * Usage: node scripts/generate-gh-pages-redirects.mjs
 */
import matter from 'gray-matter';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRY_FILE = fileURLToPath(import.meta.url);
const ROOT = resolve(import.meta.dirname, '..');
export const CONTENT_DIR = join(ROOT, 'content', 'smells');
export const OUTPUT_DIR = join(ROOT, 'gh-pages-redirects');
export const KILL_SWITCH_SOURCE = join(ROOT, 'public', 'sw.js');
export const TARGET_DOMAIN = 'https://codesmells.org';
export const LEGACY_SITE_URL = 'https://luzkan.github.io/smells';

const SITE_TITLE = 'Code Smells Catalog';
const smellCount = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).length;
const SITE_DESCRIPTION = `A comprehensive catalog of ${smellCount} code smells - structured, browsable reference for developers and researchers.`;

/**
 * @typedef {{
 *   slug: string;
 *   title: string;
 *   lastUpdateDate: string;
 *   obstruction: string[];
 * }} SmellEntry
 */

/**
 * @typedef {{
 *   type: 'text';
 *   relativePath: string;
 *   contents: string;
 * }} TextArtifact
 */

/**
 * @typedef {{
 *   type: 'copy';
 *   relativePath: string;
 *   sourcePath: string;
 * }} CopyArtifact
 */

/** @typedef {TextArtifact | CopyArtifact} Artifact */

/**
 * @param {string} value
 * @returns {string}
 */
function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return typeof value === 'string' && value.length > 0 ? value : '1970-01-01';
}

/**
 * @param {string} value
 * @returns {string}
 */
function toUtcRssDate(value) {
  return new Date(`${value}T00:00:00Z`).toUTCString();
}

/**
 * @param {SmellEntry} smell
 * @returns {string}
 */
function buildFeedItemDescription(smell) {
  const categories =
    smell.obstruction.length > 0 ? smell.obstruction.join(', ') : 'multiple categories';
  return `${smell.title} - a code smell classified under ${categories}. Part of the ${SITE_TITLE}.`;
}

/**
 * @param {string} targetPath
 * @returns {string}
 */
function buildTargetUrl(targetPath) {
  return `${TARGET_DOMAIN}${targetPath}`;
}

/**
 * Generate a redirect HTML page that preserves client-side state for browsers.
 *
 * @param {string} targetPath
 * @returns {string}
 */
export function buildRedirectHtml(targetPath) {
  const fullUrl = buildTargetUrl(targetPath);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${fullUrl}">
  <link rel="canonical" href="${fullUrl}">
  <title>Redirecting to ${fullUrl}</title>
  <script>
    // Remove the legacy Gatsby service worker before swapping domains.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        registrations.forEach(function(registration) { registration.unregister(); });
      });
    }

    window.location.replace('${fullUrl}' + window.location.search + window.location.hash);
  </script>
</head>
<body>
  <p>Redirecting to <a href="${fullUrl}">${fullUrl}</a>...</p>
</body>
</html>`;
}

/**
 * Parse the smell markdown collection into feed-friendly metadata.
 *
 * @param {string} [contentDir]
 * @returns {SmellEntry[]}
 */
export function getSmellEntries(contentDir = CONTENT_DIR) {
  return readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/u, '');
      const source = readFileSync(join(contentDir, fileName), 'utf-8');
      const { data } = matter(source);
      const rawObstruction = Array.isArray(data.categories?.obstruction)
        ? data.categories.obstruction
        : [];

      return {
        slug,
        title:
          typeof data.meta?.title === 'string' && data.meta.title.length > 0
            ? data.meta.title
            : slug,
        lastUpdateDate: normalizeDate(data.meta?.last_update_date),
        obstruction: rawObstruction.filter((value) => typeof value === 'string' && value !== '---'),
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

/**
 * Build a compatibility RSS feed for the legacy GitHub Pages URL.
 *
 * @param {SmellEntry[]} smells
 * @returns {string}
 */
export function buildCompatibilityRssXml(smells) {
  const latestDate = smells.reduce((latest, smell) => {
    if (smell.lastUpdateDate > latest) {
      return smell.lastUpdateDate;
    }

    return latest;
  }, '1970-01-01');

  const items = smells
    .map((smell) => {
      const articleUrl = buildTargetUrl(`/smells/${smell.slug}`);

      return `    <item>
      <title>${escapeXml(smell.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <pubDate>${escapeXml(toUtcRssDate(smell.lastUpdateDate))}</pubDate>
      <description>${escapeXml(buildFeedItemDescription(smell))}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${TARGET_DOMAIN}/</link>
    <atom:link href="${LEGACY_SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${escapeXml(toUtcRssDate(latestDate))}</lastBuildDate>
    <generator>scripts/generate-gh-pages-redirects.mjs</generator>
${items}
  </channel>
</rss>
`;
}

/**
 * Build the full gh-pages artifact map for cutover.
 *
 * @param {SmellEntry[]} smells
 * @param {{ killSwitchSource?: string }} [options]
 * @returns {Artifact[]}
 */
export function buildArtifactPlan(smells, options = {}) {
  const killSwitchSource = options.killSwitchSource ?? KILL_SWITCH_SOURCE;

  return [
    {
      type: 'text',
      relativePath: 'index.html',
      contents: buildRedirectHtml('/'),
    },
    {
      type: 'text',
      relativePath: 'about/index.html',
      contents: buildRedirectHtml('/about'),
    },
    {
      type: 'text',
      relativePath: 'rss.xml',
      contents: buildCompatibilityRssXml(smells),
    },
    {
      type: 'copy',
      relativePath: 'sw.js',
      sourcePath: killSwitchSource,
    },
    ...smells.map((smell) => ({
      type: 'text',
      relativePath: `${smell.slug}/index.html`,
      contents: buildRedirectHtml(`/smells/${smell.slug}`),
    })),
  ];
}

/**
 * Write the artifact plan to disk.
 *
 * @param {Artifact[]} artifacts
 * @param {{ outputDir?: string }} [options]
 * @returns {Artifact[]}
 */
export function writeArtifacts(artifacts, options = {}) {
  const outputDir = options.outputDir ?? OUTPUT_DIR;

  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  for (const artifact of artifacts) {
    const fullPath = join(outputDir, artifact.relativePath);
    mkdirSync(dirname(fullPath), { recursive: true });

    if (artifact.type === 'copy') {
      copyFileSync(artifact.sourcePath, fullPath);
      continue;
    }

    writeFileSync(fullPath, artifact.contents, 'utf-8');
  }

  return artifacts;
}

/**
 * Generate all GitHub Pages cutover artifacts.
 *
 * @param {{ contentDir?: string; outputDir?: string; killSwitchSource?: string }} [options]
 * @returns {{ smells: SmellEntry[]; artifacts: Artifact[] }}
 */
export function generateGhPagesRedirects(options = {}) {
  const smells = getSmellEntries(options.contentDir ?? CONTENT_DIR);
  const artifacts = buildArtifactPlan(smells, {
    killSwitchSource: options.killSwitchSource ?? KILL_SWITCH_SOURCE,
  });

  writeArtifacts(artifacts, { outputDir: options.outputDir ?? OUTPUT_DIR });

  return { smells, artifacts };
}

function main() {
  const { smells, artifacts } = generateGhPagesRedirects();

  console.log(`Generating cutover artifacts for ${smells.length} smells...`);
  artifacts.forEach((artifact) => {
    console.log(`  -> ${artifact.relativePath}`);
  });
  console.log(`Done. Generated ${artifacts.length} artifacts in gh-pages-redirects/`);
}

if (process.argv[1] && resolve(process.argv[1]) === ENTRY_FILE) {
  main();
}
