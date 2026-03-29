import { computed } from 'nanostores';
import { $filters } from '../filters';
import { $searchQuery } from '../search';
import { $allSmells } from '../smells-data';
import { matchesFilters, matchesSearch } from '../../lib/catalog/filter-engine';

export const $filteredSlugs = computed(
  [$allSmells, $filters, $searchQuery],
  (allSmells, filters, query): Set<string> =>
    new Set(
      allSmells
        .filter((smell) => matchesFilters(smell, filters) && matchesSearch(smell, query))
        .map((smell) => smell.slug),
    ),
);
