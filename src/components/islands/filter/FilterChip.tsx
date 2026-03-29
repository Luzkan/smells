import { getDimension, getDisplayLabel, toCssVars } from '../../../lib/catalog/dimensions';
import type { DimensionKey } from '../../../lib/catalog/dimensions';
import { cx } from '../../../lib/cx';

interface FilterChipProps {
  label: string;
  count: number;
  isActive: boolean;
  dimensionKey: DimensionKey;
  onClick: () => void;
}

export function FilterChip({ label, count, isActive, dimensionKey, onClick }: FilterChipProps) {
  const isDisabled = count === 0 && !isActive;
  const dim = getDimension(dimensionKey);
  const displayLabel = getDisplayLabel(label, dimensionKey);

  return (
    <button
      type="button"
      class={cx(
        'filter-sidebar__chip',
        isActive && 'filter-sidebar__chip--active',
        isDisabled && 'filter-sidebar__chip--zero',
      )}
      style={isActive ? toCssVars(dim) : undefined}
      onClick={isDisabled ? undefined : onClick}
      aria-pressed={isActive}
      disabled={isDisabled}
      title={label === displayLabel ? undefined : label}
    >
      {displayLabel}
      <span class="filter-sidebar__chip-count">{count}</span>
    </button>
  );
}
