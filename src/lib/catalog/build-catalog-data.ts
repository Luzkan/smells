/**
 * Build-time data preparation for the catalog page.
 * Keeps index.astro frontmatter focused on imports + function calls.
 */

import type { CollectionEntry } from 'astro:content';
import { getObstructionTheme } from '../category-colors';
import { resolveSmellDescription } from '../content/extract-description';
import { getBody, getPrimaryObstruction } from '../content/smell-utils';
import type { ObstructionCategory } from '../constants';
import type { SmellFilterData } from '../types';

export function buildCatalogHeroStats(smells: CollectionEntry<'smells'>[]) {
  return {
    categoryCount: new Set(smells.flatMap((s) => s.data.categories.obstruction)).size,
    hierarchyCount: new Set(smells.flatMap((s) => s.data.categories.smell_hierarchies)).size,
  };
}

export function buildCategoryGroups(smells: CollectionEntry<'smells'>[]) {
  const categoryMap = new Map<ObstructionCategory, string[]>();
  for (const smell of smells) {
    const primary = getPrimaryObstruction(smell.data.categories);
    const existing = categoryMap.get(primary);
    if (existing) {
      existing.push(smell.data.slug);
    } else {
      categoryMap.set(primary, [smell.data.slug]);
    }
  }

  return [...categoryMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, slugs]) => ({
      name,
      color: getObstructionTheme(name).color,
      slugs,
    }));
}

export function buildCatalogJsonLdData(smells: CollectionEntry<'smells'>[]) {
  return smells.map((s) => ({
    title: s.data.meta.title,
    slug: s.data.slug,
    description: resolveSmellDescription(s.data.meta.description, getBody(s), 250, s.data.slug),
    alternateName: s.data.meta.known_as.length ? s.data.meta.known_as : undefined,
  }));
}

export function buildSmellsFilterData(smells: CollectionEntry<'smells'>[]): SmellFilterData[] {
  return smells.map((s) => ({
    slug: s.data.slug,
    meta: {
      last_update_date: s.data.meta.last_update_date,
      title: s.data.meta.title,
      known_as: s.data.meta.known_as,
    },
    categories: s.data.categories,
  }));
}
