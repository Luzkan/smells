import { computed } from 'nanostores';
import { $filters } from '../filters';

/**
 * Total number of active filter values across all dimensions.
 */
export const $activeCount = computed($filters, (filters): number => {
  return Object.values(filters).reduce((count, dimSet) => count + dimSet.size, 0);
});
