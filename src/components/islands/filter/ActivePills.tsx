import {
  DIMENSION_CONFIG,
  getDimension,
  getDisplayLabel,
  toCssVars,
} from '../../../lib/catalog/dimensions';
import type { DimensionKey, FilterState } from '../../../lib/catalog/dimensions';
import { cx } from '../../../lib/cx';

interface ActivePillsProps {
  filters: FilterState;
  query: string;
  onRemoveFilter: (dimension: DimensionKey, value: string) => void;
  onClearSearch: () => void;
}

export function ActivePills({
  filters,
  query,
  onRemoveFilter,
  onClearSearch,
}: Readonly<ActivePillsProps>) {
  const pills = DIMENSION_CONFIG.flatMap((dim) =>
    [...filters[dim.key]].map((value) => {
      const label = getDisplayLabel(value, dim.key);
      const accessibleLabel = value.length > label.length ? value : label;
      return {
        key: `${dim.key}-${value}`,
        dimension: dim.key,
        value,
        label,
        accessibleLabel,
      };
    }),
  );

  const hasQuery = query.trim().length > 0;
  const hasAny = pills.length > 0 || hasQuery;

  return (
    <div class={cx('filter-sidebar__pills', hasAny && 'filter-sidebar__pills--visible')}>
      {pills.map((pill) => {
        const dim = getDimension(pill.dimension);
        return (
          <button
            key={pill.key}
            type="button"
            class="filter-sidebar__pill"
            style={toCssVars(dim)}
            onClick={() => onRemoveFilter(pill.dimension, pill.value)}
            aria-label={`Remove ${pill.accessibleLabel} filter`}
            title={pill.accessibleLabel === pill.label ? undefined : pill.accessibleLabel}
          >
            {pill.label}
            <span class="filter-sidebar__pill-x" aria-hidden="true">
              &times;
            </span>
          </button>
        );
      })}
      {hasQuery && (
        <button
          type="button"
          class="filter-sidebar__pill filter-sidebar__pill--search"
          onClick={onClearSearch}
          aria-label="Clear search"
        >
          &ldquo;{query}&rdquo;
          <span class="filter-sidebar__pill-x" aria-hidden="true">
            &times;
          </span>
        </button>
      )}
    </div>
  );
}
