import { afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildArtifactPlan,
  generateGhPagesRedirects,
  getSmellEntries,
  LEGACY_SITE_URL,
  TARGET_DOMAIN,
} from '../../../scripts/generate-gh-pages-redirects.mjs';

let tempDir: string | undefined;

function makeTempDir() {
  tempDir = mkdtempSync(join(tmpdir(), 'gh-pages-redirects-'));
  return tempDir;
}

afterEach(() => {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('GH Pages redirect generator', () => {
  it('builds a branch-root artifact plan without doubled smells paths', () => {
    const artifacts = buildArtifactPlan(getSmellEntries());

    expect(artifacts.some((artifact) => artifact.relativePath === 'index.html')).toBe(true);
    expect(artifacts.some((artifact) => artifact.relativePath === 'about/index.html')).toBe(true);
    expect(artifacts.some((artifact) => artifact.relativePath === 'rss.xml')).toBe(true);
    expect(artifacts.some((artifact) => artifact.relativePath === 'sw.js')).toBe(true);
    expect(artifacts.some((artifact) => artifact.relativePath === 'feature-envy/index.html')).toBe(
      true,
    );
    expect(
      artifacts.some((artifact) => artifact.relativePath === 'smells/feature-envy/index.html'),
    ).toBe(false);
    expect(artifacts.some((artifact) => artifact.relativePath === 'smells/sw.js')).toBe(false);
    expect(artifacts.every((artifact) => !artifact.relativePath.startsWith('smells/'))).toBe(true);
  });

  it('rewrites the output tree and preserves search plus hash in redirect pages', () => {
    const outputDir = makeTempDir();
    mkdirSync(join(outputDir, 'smells', 'feature-envy'), { recursive: true });
    writeFileSync(join(outputDir, 'smells', 'feature-envy', 'index.html'), 'stale', 'utf-8');

    generateGhPagesRedirects({ outputDir });

    expect(existsSync(join(outputDir, 'smells'))).toBe(false);
    expect(existsSync(join(outputDir, 'index.html'))).toBe(true);
    expect(existsSync(join(outputDir, 'about', 'index.html'))).toBe(true);
    expect(existsSync(join(outputDir, 'feature-envy', 'index.html'))).toBe(true);
    expect(existsSync(join(outputDir, 'sw.js'))).toBe(true);

    const html = readFileSync(join(outputDir, 'feature-envy', 'index.html'), 'utf-8');
    expect(html).toContain(
      '<link rel="canonical" href="https://codesmells.org/smells/feature-envy">',
    );
    expect(html).toContain('content="0;url=https://codesmells.org/smells/feature-envy"');
    expect(html).toContain(
      "window.location.replace('https://codesmells.org/smells/feature-envy' + window.location.search + window.location.hash);",
    );
  });

  it('writes a real compatibility rss.xml at the legacy feed URL', () => {
    const outputDir = makeTempDir();
    const { smells } = generateGhPagesRedirects({ outputDir });
    const xml = readFileSync(join(outputDir, 'rss.xml'), 'utf-8');

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain(
      `<atom:link href="${LEGACY_SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    );
    expect(xml).toContain(`<link>${TARGET_DOMAIN}/</link>`);
    expect(xml).toContain('<link>https://codesmells.org/smells/feature-envy</link>');
    expect(xml).not.toContain('<!DOCTYPE html>');
    expect((xml.match(/<item>/g) ?? []).length).toBe(smells.length);
  });
});
