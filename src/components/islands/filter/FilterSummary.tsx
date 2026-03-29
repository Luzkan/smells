import { useRef, useEffect } from 'preact/hooks';
import { cx } from '../../../lib/cx';

interface FilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  activeFilterCount: number;
  activeFilterLabels: string[];
  searchQuery: string;
  onClearAll: () => void;
}

export function FilterSummary({
  filteredCount,
  totalCount,
  activeFilterCount,
  activeFilterLabels,
  searchQuery,
  onClearAll,
}: FilterSummaryProps) {
  const hasFilters = activeFilterCount > 0;
  const hasSearch = searchQuery.trim().length > 0;
  const hasAnything = hasFilters || hasSearch;

  // Progress bar width
  const progressWidth = totalCount > 0 ? (filteredCount / totalCount) * 100 : 100;

  // Shimmer animation: trigger on filteredCount change
  const barRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(filteredCount);
  useEffect(() => {
    if (prevCount.current !== filteredCount && barRef.current) {
      barRef.current.classList.remove('filter-sidebar__progress-bar--shimmer');
      // Force reflow to restart animation
      void barRef.current.offsetWidth;
      barRef.current.classList.add('filter-sidebar__progress-bar--shimmer');
    }
    prevCount.current = filteredCount;
  }, [filteredCount]);

  // Build "Showing X" summary text
  let summaryText = '';
  if (hasAnything) {
    const parts: string[] = [];
    if (hasSearch) parts.push(`matching "${searchQuery.trim()}"`);
    if (activeFilterLabels.length > 0) {
      parts.push(activeFilterLabels.join(' \u00B7 '));
    }
    summaryText = 'Showing ' + parts.join(' \u00B7 ');
  }

  return (
    <>
      <div class="filter-sidebar__header">
        <div>
          <span class="filter-sidebar__result-count">{filteredCount}</span>
          <span class="filter-sidebar__result-label">
            {filteredCount === 1 ? 'smell' : 'smells'}
          </span>
        </div>
        <button
          type="button"
          class={cx(
            'filter-sidebar__clear-btn',
            hasAnything && 'filter-sidebar__clear-btn--visible',
          )}
          onClick={onClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      {/* Progress bar */}
      <div class="filter-sidebar__progress-wrap">
        <div
          ref={barRef}
          class="filter-sidebar__progress-bar"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Filter summary text */}
      <div
        class={cx(
          'filter-sidebar__filter-summary',
          hasAnything && 'filter-sidebar__filter-summary--visible',
        )}
      >
        {summaryText}
      </div>
    </>
  );
}
