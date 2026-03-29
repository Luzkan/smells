import { computed } from 'nanostores';
import { $allSmells } from '../smells-data';
import { $filters } from '../filters';
import { $searchQuery } from '../search';
import { DIMENSION_CONFIG, getSmellDimensionValues } from '../../lib/catalog/dimensions';
import { matchesFilters, matchesSearch } from '../../lib/catalog/filter-engine';
import type { DimensionKey, FilterState } from '../../lib/catalog/dimensions';
import { typedFromEntries } from '../../lib/typed-from-entries';

/**
 * For each dimension value, count how many smells would match
 * if that value were toggled on (respecting all OTHER active dimensions + search).
 *
 * This gives the user accurate chip counts: "if I click this chip,
 * at least N smells will match."
 */
export const $filterCounts = computed(
  [$allSmells, $filters, $searchQuery],
  (allSmells, filters, query): Record<DimensionKey, Record<string, number>> => {
    const counts: Record<DimensionKey, Record<string, number>> = typedFromEntries(
      DIMENSION_CONFIG.map((dim) => {
        const dimCounts: Record<string, number> = {};
        return [dim.key, dimCounts] as const;
      }),
    );

    if (allSmells.length === 0) return counts;

    for (const dim of DIMENSION_CONFIG) {
      // Build a filter state with THIS dimension cleared
      // so we count "how many smells match if this value were the only one in this dimension"
      const filtersWithoutDim: FilterState = { ...filters, [dim.key]: new Set<string>() };

      for (const smell of allSmells) {
        // Does this smell match all OTHER dimensions + search?
        if (!matchesFilters(smell, filtersWithoutDim) || !matchesSearch(smell, query)) {
          continue;
        }
        const values = getSmellDimensionValues(smell, dim.key);
        for (const val of values) {
          counts[dim.key][val] = (counts[dim.key][val] || 0) + 1;
        }
      }
    }

    return counts;
  },
);
