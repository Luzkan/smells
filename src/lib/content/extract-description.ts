/**
 * Shared description helpers for smell entries.
 *
 * `deriveMetaDescription()` extracts the first non-heading paragraph from
 * markdown/parsed sections, strips formatting, and truncates it.
 *
 * `resolveSmellDescription()` prefers authored `meta.description` copy and
 * falls back to raw frontmatter lookup and finally derived overview text when
 * the authored field is absent.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { stripMarkdownFormatting } from './strip-markdown';
import type { ParsedArticleSections } from './article-sections-parser';

type DescriptionSource = string | ParsedArticleSections;

const GOOGLE_META_DESC_LIMIT = 160;
const smellDescriptionCache = new Map<string, string | null>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getMetaDescription(data: unknown): string | null {
  if (!isRecord(data) || !isRecord(data.meta)) return null;
  return typeof data.meta.description === 'string' ? data.meta.description : null;
}

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).replace(/\s+\S*$/, '') + '...';
}

export function deriveMetaDescription(
  source: DescriptionSource,
  maxLength = GOOGLE_META_DESC_LIMIT,
): string {
  const lines = typeof source === 'string' ? source.split('\n') : source.overviewLines;
  let paragraph = '';
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (
      !trimmedLine ||
      trimmedLine.startsWith('#') ||
      trimmedLine.startsWith('---') ||
      trimmedLine.startsWith('![') ||
      trimmedLine.startsWith('[')
    )
      continue;
    paragraph = trimmedLine;
    break;
  }
  return truncateDescription(stripMarkdownFormatting(paragraph), maxLength);
}

function loadAuthoredDescriptionBySlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  if (smellDescriptionCache.has(slug)) {
    return smellDescriptionCache.get(slug) ?? undefined;
  }

  try {
    const filePath = join(process.cwd(), 'content', 'smells', `${slug}.md`);
    const fileContents = readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContents);
    const description = getMetaDescription(parsed.data);
    smellDescriptionCache.set(slug, description);
    return description ?? undefined;
  } catch {
    smellDescriptionCache.set(slug, null);
    return undefined;
  }
}

export function resolveSmellDescription(
  authoredDescription: string | undefined,
  source: DescriptionSource,
  maxLength = GOOGLE_META_DESC_LIMIT,
  slug?: string,
): string {
  const trimmedAuthoredDescription =
    authoredDescription?.trim() ?? loadAuthoredDescriptionBySlug(slug)?.trim();
  if (trimmedAuthoredDescription) {
    return truncateDescription(stripMarkdownFormatting(trimmedAuthoredDescription), maxLength);
  }
  return deriveMetaDescription(source, maxLength);
}
