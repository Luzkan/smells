import { atom } from 'nanostores';
import { createEmptyFilters } from '../lib/catalog/dimensions';
import type { DimensionKey, FilterState } from '../lib/catalog/dimensions';

export const $filters = atom<FilterState>(createEmptyFilters());

export function toggleFilter(dimension: DimensionKey, value: string): void {
  const current = $filters.get();
  const dimSet = new Set(current[dimension]);
  if (dimSet.has(value)) dimSet.delete(value);
  else dimSet.add(value);
  $filters.set({ ...current, [dimension]: dimSet });
}

export function clearFilters(): void {
  $filters.set(createEmptyFilters());
}

export function setFilters(filters: FilterState): void {
  $filters.set(filters);
}
