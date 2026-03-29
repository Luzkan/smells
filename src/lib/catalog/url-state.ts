import { DIMENSION_CONFIG, createEmptyFilters, isDimensionKey } from './dimensions';
import type { FilterState } from './dimensions';
import { typedFromEntries } from '../typed-from-entries';

/**
 * Map between store dimension keys and shorter URL param names.
 * smell_hierarchies -> hierarchy (shorter URLs).
 */
const STORE_TO_URL = typedFromEntries(
  DIMENSION_CONFIG.map((dim) => [dim.key, dim.urlParam] as const),
);

const URL_TO_STORE = Object.fromEntries(DIMENSION_CONFIG.map((dim) => [dim.urlParam, dim.key]));

export function serializeFilters(filters: FilterState, query: string): string {
  const params = new URLSearchParams();

  for (const dim of DIMENSION_CONFIG) {
    const active = filters[dim.key];
    if (active.size > 0) {
      const urlKey = STORE_TO_URL[dim.key];
      // Sort values for stable URLs
      const sorted = [...active].sort((a, b) => a.localeCompare(b));
      for (const val of sorted) {
        params.append(urlKey, val);
      }
    }
  }

  if (query.trim()) {
    params.set('q', query.trim());
  }

  const hash = params.toString();
  return hash ? `#${hash}` : '';
}

export function deserializeFilters(hash: string): {
  filters: FilterState;
  query: string;
} {
  const filters: FilterState = createEmptyFilters();

  let query = '';

  if (!hash || hash === '#') {
    return { filters, query };
  }

  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

  for (const [key, value] of params.entries()) {
    if (key === 'q') {
      query = value;
      continue;
    }
    const storeKey = URL_TO_STORE[key];
    if (storeKey && isDimensionKey(storeKey)) {
      filters[storeKey].add(value);
    }
  }

  return { filters, query };
}

/**
 * Create a URL hash syncer with encapsulated state.
 * Avoids module-level mutable state — the caller owns the lifecycle.
 */
export function createHashSyncer() {
  let lastHash = '';
  return {
    sync(filters: FilterState, query: string): void {
      const hash = serializeFilters(filters, query);
      if (hash === lastHash) return;
      lastHash = hash;

      if (globalThis.window !== undefined) {
        const url = new URL(globalThis.window.location.href);
        url.hash = hash;
        globalThis.window.history.replaceState(null, '', hash || url.pathname + url.search);
      }
    },
    reset() {
      lastHash = '';
    },
  };
}
