import { initializeSmellsData } from '../../stores/smells-data';
import { $filters, setFilters } from '../../stores/filters';
import { $searchQuery, setSearchQuery } from '../../stores/search';
import { $filteredSlugs } from '../../stores/derived/filtered-smells';
import { applyCardVisibility } from './card-visibility';
import { applySearchHighlights, primeSearchHighlightCache } from './search-highlight';
import { deserializeFilters, createHashSyncer } from './url-state';
import { trackEvent } from '../analytics/tracker';
import type { SmellFilterData } from '../types';
import { CARD_SELECTOR } from './card-selectors';
import {
  EXPANSE_VALUES,
  OBSTRUCTION_CATEGORIES,
  OCCURRENCE_VALUES,
  SMELL_HIERARCHY_VALUES,
} from '../constants';

const EXPANSE_SET: ReadonlySet<string> = new Set(EXPANSE_VALUES);
const OBSTRUCTION_SET: ReadonlySet<string> = new Set(OBSTRUCTION_CATEGORIES);
const OCCURRENCE_SET: ReadonlySet<string> = new Set(OCCURRENCE_VALUES);
const SMELL_HIERARCHY_SET: ReadonlySet<string> = new Set(SMELL_HIERARCHY_VALUES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === 'string');
}

function isAllowedStringArray<T extends string>(
  value: unknown,
  allowed: ReadonlySet<string>,
): value is T[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is T => typeof item === 'string' && allowed.has(item))
  );
}

function isExpanseValue(value: unknown): value is SmellFilterData['categories']['expanse'] {
  return typeof value === 'string' && EXPANSE_SET.has(value);
}

function isObstructionArray(value: unknown): value is SmellFilterData['categories']['obstruction'] {
  return isAllowedStringArray<SmellFilterData['categories']['obstruction'][number]>(
    value,
    OBSTRUCTION_SET,
  );
}

function isOccurrenceArray(value: unknown): value is SmellFilterData['categories']['occurrence'] {
  return isAllowedStringArray<SmellFilterData['categories']['occurrence'][number]>(
    value,
    OCCURRENCE_SET,
  );
}

function isSmellHierarchyArray(
  value: unknown,
): value is SmellFilterData['categories']['smell_hierarchies'] {
  return isAllowedStringArray<SmellFilterData['categories']['smell_hierarchies'][number]>(
    value,
    SMELL_HIERARCHY_SET,
  );
}

function parseSerializedDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toSmellFilterData(value: unknown): SmellFilterData | null {
  if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.categories)) return null;

  const lastUpdateDate = parseSerializedDate(value.meta.last_update_date);
  if (
    typeof value.slug !== 'string' ||
    typeof value.meta.title !== 'string' ||
    !lastUpdateDate ||
    !isStringArray(value.meta.known_as) ||
    !isExpanseValue(value.categories.expanse) ||
    !isObstructionArray(value.categories.obstruction) ||
    !isOccurrenceArray(value.categories.occurrence) ||
    !isSmellHierarchyArray(value.categories.smell_hierarchies) ||
    !isStringArray(value.categories.tags)
  ) {
    return null;
  }

  return {
    slug: value.slug,
    meta: {
      title: value.meta.title,
      last_update_date: lastUpdateDate,
      known_as: value.meta.known_as,
    },
    categories: {
      expanse: value.categories.expanse,
      obstruction: value.categories.obstruction,
      occurrence: value.categories.occurrence,
      smell_hierarchies: value.categories.smell_hierarchies,
      tags: value.categories.tags,
    },
  };
}

function parseSmellsData(textContent: string | null): SmellFilterData[] {
  const parsed: unknown = JSON.parse(textContent || '[]');
  if (!Array.isArray(parsed)) {
    throw new TypeError('initCatalog: #smells-data must be an array');
  }

  const parsedArray: unknown[] = parsed;
  return parsedArray.map((item, index) => {
    const smell = toSmellFilterData(item);
    if (!smell) {
      throw new TypeError(`initCatalog: invalid smell data at index ${index}`);
    }
    return smell;
  });
}

/**
 * Initialize the catalog page:
 * 1. Parse #smells-data JSON
 * 2. Seed $allSmells store
 * 3. Read URL hash into $filters
 * 4. Subscribe to $filteredSlugs and apply card visibility
 * 5. Subscribe to $filters + $searchQuery for URL hash sync
 *
 * Returns a cleanup function. Throws if initialization fails.
 */
export function initCatalog(doc: Document): () => void {
  const jsonEl = doc.getElementById('smells-data');
  if (!jsonEl) throw new Error('initCatalog: #smells-data element not found');

  let data: SmellFilterData[];
  try {
    data = parseSmellsData(jsonEl.textContent);
  } catch {
    throw new Error('initCatalog: failed to parse #smells-data JSON');
  }

  initializeSmellsData(data);

  const hash = globalThis.location?.hash ?? '';
  const { filters, query } = deserializeFilters(hash);
  setFilters(filters);
  setSearchQuery(query);

  if (Object.values(filters).some((s) => s.size > 0) || query) {
    const activeDims = Object.entries(filters)
      .filter(([, set]) => set.size > 0)
      .map(([key]) => key);
    trackEvent({
      name: 'filter_restore',
      params: { dimensions: activeDims.join(',') || 'none', query },
    });
  }

  const cards = doc.querySelectorAll<HTMLElement>(CARD_SELECTOR);
  const liveRegion = doc.getElementById('filter-results-live');
  primeSearchHighlightCache(cards);

  const unsubSlugs = $filteredSlugs.subscribe((slugs) => {
    applyCardVisibility(slugs, cards, liveRegion);
  });

  const hashSyncer = createHashSyncer();

  const unsubFilters = $filters.subscribe((filters) => {
    hashSyncer.sync(filters, $searchQuery.get());
  });

  const unsubSearch = $searchQuery.subscribe((query) => {
    hashSyncer.sync($filters.get(), query);
    applySearchHighlights(query, cards);
  });

  const cleanup = () => {
    unsubSlugs();
    unsubFilters();
    unsubSearch();
    hashSyncer.reset();
  };

  doc.addEventListener('astro:before-swap', cleanup, { once: true });

  return cleanup;
}
