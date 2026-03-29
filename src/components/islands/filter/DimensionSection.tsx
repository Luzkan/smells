import { useState, useCallback } from 'preact/hooks';
import { FilterChip } from './FilterChip';
import type { DimensionKey } from '../../../lib/catalog/dimensions';
import { cx } from '../../../lib/cx';

interface DimensionSectionProps {
  dimensionKey: DimensionKey;
  label: string;
  color: string;
  values: string[];
  activeValues: Set<string>;
  counts: Record<string, number>;
  onToggle: (value: string) => void;
}

export function DimensionSection({
  dimensionKey,
  label,
  color,
  values,
  activeValues,
  counts,
  onToggle,
}: Readonly<DimensionSectionProps>) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const hasActive = activeValues.size > 0;

  // Sort values: active first, then by count descending, then alphabetical
  const sorted = [...values].sort((a, b) => {
    const aActive = activeValues.has(a) ? 1 : 0;
    const bActive = activeValues.has(b) ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    const aCount = counts[a] ?? 0;
    const bCount = counts[b] ?? 0;
    if (aCount !== bCount) return bCount - aCount;
    return a.localeCompare(b);
  });

  return (
    <div
      class={cx('filter-sidebar__dimension', collapsed && 'filter-sidebar__dimension--collapsed')}
    >
      <button
        type="button"
        class="filter-sidebar__dimension-header"
        onClick={toggleCollapse}
        aria-expanded={!collapsed}
      >
        <span class="filter-sidebar__dimension-color-bar" style={{ background: `var(${color})` }} />
        <span class="filter-sidebar__dimension-name">{label}</span>
        <span class="filter-sidebar__dimension-count">{values.length}</span>
        <span
          class="filter-sidebar__dimension-dot"
          style={{ background: `var(${color})`, transform: hasActive ? 'scale(1)' : 'scale(0)' }}
        />
        <span class="filter-sidebar__dimension-chevron" aria-hidden="true">
          &#9660;
        </span>
      </button>
      <div class="filter-sidebar__dimension-chips-wrap">
        <div class="filter-sidebar__dimension-chips">
          {sorted.map((val) => (
            <FilterChip
              key={val}
              label={val}
              count={counts[val] ?? 0}
              isActive={activeValues.has(val)}
              dimensionKey={dimensionKey}
              onClick={() => onToggle(val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
