import type { CollectionEntry } from 'astro:content';
import type { SmellFrontmatter } from '../../schemas/smell';
import type { ObstructionCategory, RelationType } from '../constants';
import type { SmellLink } from '../types';
import { resolveSmellDescription } from './extract-description';

export type HistoryEntry = SmellFrontmatter['history'][number];
export type RelatedSmell = SmellFrontmatter['relations']['related_smells'][number];

/**
 * Group related smells by their relationship type.
 * Returns a record mapping each type to the list of smell names.
 */
export function groupRelationsByType(
  relations: RelatedSmell[],
): Partial<Record<RelationType, string[]>> {
  const groups: Partial<Record<RelationType, string[]>> = {};

  for (const rel of relations) {
    for (const t of rel.type) {
      groups[t] ??= [];
      groups[t].push(rel.name);
    }
  }

  return groups;
}

const LEADING_NON_ALPHA = /^[^a-zA-Z0-9]+/;

export function sortSmellsByTitle(
  smells: CollectionEntry<'smells'>[],
): CollectionEntry<'smells'>[] {
  return [...smells].sort((a, b) =>
    a.data.meta.title
      .replace(LEADING_NON_ALPHA, '')
      .localeCompare(b.data.meta.title.replace(LEADING_NON_ALPHA, '')),
  );
}

/**
 * Get the primary obstruction category from a smell's categories.
 * Falls back to 'Other' if the array is empty.
 */
export function getPrimaryObstruction(
  categories: SmellFrontmatter['categories'],
): ObstructionCategory {
  return categories.obstruction[0];
}

export function findOriginOrEarliestEntry(history: HistoryEntry[]): HistoryEntry | null {
  return history.find((e) => e.type === 'origin') ?? history[0] ?? null;
}

export function getBody(entry: CollectionEntry<'smells'>): string {
  if (!entry.body) throw new Error(`Smell "${entry.id}" has no body content`);
  return entry.body;
}

/**
 * Build a lightweight SmellLink reference from a collection entry.
 * Used for prev/next navigation, 404 suggestions, and anywhere a
 * full SmellCardData projection is overkill.
 */
const PREV_NEXT_DESC_LENGTH = 120;

export function toSmellLink(entry: CollectionEntry<'smells'>): SmellLink {
  return {
    slug: entry.data.slug,
    href: `/smells/${entry.data.slug}`,
    title: entry.data.meta.title,
    obstruction: getPrimaryObstruction(entry.data.categories),
    occurrence: entry.data.categories.occurrence[0],
    description: resolveSmellDescription(
      entry.data.meta.description,
      getBody(entry),
      PREV_NEXT_DESC_LENGTH,
      entry.data.slug,
    ),
  };
}
