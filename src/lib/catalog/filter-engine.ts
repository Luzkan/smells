import type { SmellFilterData } from '../types';
import { DIMENSION_CONFIG, getSmellDimensionValues } from './dimensions';
import type { FilterState } from './dimensions';

/**
 * OR within a dimension (any selected value matches),
 * AND across dimensions (all active dimensions must pass).
 * Empty dimension = no constraint.
 */
export function matchesFilters(smell: SmellFilterData, filters: FilterState): boolean {
  for (const dim of DIMENSION_CONFIG) {
    const active = filters[dim.key];
    if (active.size === 0) continue;
    const values = getSmellDimensionValues(smell, dim.key);
    if (!values.some((v) => active.has(v))) return false;
  }
  return true;
}

export function matchesSearch(smell: SmellFilterData, query: string): boolean {
  if (!query.trim()) return true;
  const normalizedQuery = query.toLowerCase().trim();
  const searchable = [smell.meta.title, ...smell.meta.known_as];
  return searchable.some((text) => text.toLowerCase().includes(normalizedQuery));
}
