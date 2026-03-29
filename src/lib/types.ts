import type { SmellFrontmatter } from '../schemas/smell';
import type { ObstructionCategory, OccurrenceValue, SmellHierarchyValue } from './constants';

/** Re-export for test fixtures and external consumers. */
export type { SmellFrontmatter as SmellEntry } from '../schemas/smell';

/**
 * SmellFilterData — the subset of SmellFrontmatter actually serialized to
 * the client for filtering. Matches the shape produced in index.astro
 * and consumed by catalog-init.ts → $allSmells → filter engine.
 */
export interface SmellFilterData {
  slug: string;
  meta: { title: string; last_update_date: Date; known_as: string[] };
  categories: SmellFrontmatter['categories'];
}

/**
 * SmellLink — lightweight reference to a smell for prev/next navigation.
 */
export interface SmellLink {
  slug: string;
  href: string;
  title: string;
  obstruction: ObstructionCategory;
  occurrence: OccurrenceValue;
  description: string;
}

/**
 * SmellCardData — projection shape consumed by the SmellCard component.
 */
export interface SmellCardData {
  slug: string;
  title: string;
  knownAs: string[];
  obstruction: SmellFrontmatter['categories']['obstruction'];
  occurrence: OccurrenceValue[];
  smellHierarchies: SmellHierarchyValue[];
  expanse: SmellFrontmatter['categories']['expanse'];
  description: string;
  refactorCount: number;
  relatedCount: number;
  originInfo: string;
}

/**
 * CodePanelData — one rendered code panel used by the CodeExample island.
 */
export interface CodePanelData {
  html: string;
  lang: string;
  caption: string;
}

/**
 * CodeTab — the two code example panel variants.
 */
export type CodeTab = 'smelly' | 'solution';

export interface CitationData {
  slug: string;
  title: string;
  author: string;
  year: number;
}

interface SeoMetaBase {
  title: string;
  description: string;
  ogImage: string;
  canonical?: string;
  noindex?: boolean;
}

export interface WebsiteSeoMeta extends SeoMetaBase {
  type: 'website';
}

export interface ArticleSeoMeta extends SeoMetaBase {
  type: 'article';
  modifiedTime: string;
}

export type SeoMeta = WebsiteSeoMeta | ArticleSeoMeta;
