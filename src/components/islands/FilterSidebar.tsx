import { useStore } from '@nanostores/preact';
import { Component } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useMemo, useRef, useState, useEffect } from 'preact/hooks';
import { $allSmells } from '../../stores/smells-data';
import { $filters, toggleFilter, clearFilters } from '../../stores/filters';
import { $searchQuery, clearSearch } from '../../stores/search';
import { $filteredSlugs } from '../../stores/derived/filtered-smells';
import { $activeCount } from '../../stores/derived/active-count';
import { $filterCounts } from '../../stores/derived/filter-counts';
import {
  DIMENSION_CONFIG,
  getSmellDimensionValues,
  getDisplayLabel,
} from '../../lib/catalog/dimensions';
import { trackEvent, normalizeQuery } from '../../lib/analytics/tracker';
import type { DimensionKey } from '../../lib/catalog/dimensions';
import { typedFromEntries } from '../../lib/typed-from-entries';
import { SearchInput } from './filter/SearchInput';
import { DimensionSection } from './filter/DimensionSection';
import { ActivePills } from './filter/ActivePills';
import { FilterSummary } from './filter/FilterSummary';
import { EmptyState } from './filter/EmptyState';
import { MobileBottomSheet } from './filter/MobileBottomSheet';
import './FilterSidebar.css';

const SEARCH_ANALYTICS_DEBOUNCE_MS = 500;

function FilterFallbackBody() {
  return (
    <p class="filter-sidebar__error-message">Filters unavailable. Showing all smells below.</p>
  );
}

class FilterErrorBoundary extends Component<
  { children: ComponentChildren },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[FilterSidebar]', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <>
          <div class="filter-sidebar__desktop filter-sidebar__desktop--error">
            <div class="filter-sidebar__error" role="status" aria-live="polite">
              <FilterFallbackBody />
            </div>
          </div>

          <MobileBottomSheet activeCount={0} showApplyButton={false}>
            <div
              class="filter-sidebar__error filter-sidebar__error--sheet"
              role="status"
              aria-live="polite"
            >
              <FilterFallbackBody />
            </div>
          </MobileBottomSheet>
        </>
      );
    }
    return this.props.children;
  }
}

function FilterSidebarInner() {
  const allSmells = useStore($allSmells);
  const filters = useStore($filters);
  const searchQuery = useStore($searchQuery);
  const filteredSlugs = useStore($filteredSlugs);
  const activeCount = useStore($activeCount);
  const filterCounts = useStore($filterCounts);

  // Collect all unique values for each dimension from the data
  const dimensionValues = useMemo(
    () =>
      typedFromEntries(
        DIMENSION_CONFIG.map(
          (dim) =>
            [
              dim.key,
              [
                ...new Set(allSmells.flatMap((smell) => getSmellDimensionValues(smell, dim.key))),
              ].sort((a, b) => a.localeCompare(b)),
            ] as const,
        ),
      ),
    [allSmells],
  );

  // Build active filter labels for the summary text
  const activeFilterLabels = useMemo(
    () =>
      DIMENSION_CONFIG.filter((dim) => filters[dim.key].size > 0).map((dim) =>
        [...filters[dim.key]].map((v) => getDisplayLabel(v, dim.key)).join(' or '),
      ),
    [filters],
  );

  const handleToggle = useCallback((dimension: DimensionKey, value: string) => {
    const current = $filters.get()[dimension];
    const action = current.has(value) ? 'remove' : 'add';
    toggleFilter(dimension, value);
    trackEvent({ name: 'filter_toggle', params: { dimension, value, action } });
  }, []);

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, []);

  const handleClearAll = useCallback(() => {
    clearFilters();
    clearSearch();
    trackEvent({ name: 'filter_reset', params: {} });
  }, []);

  const showEmpty = allSmells.length > 0 && filteredSlugs.size === 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const mobileBadgeCount = activeCount + (hasSearchQuery ? 1 : 0);

  // Scroll-fade: detect if desktop sidebar is scrollable
  const desktopRef = useRef<HTMLDivElement>(null);
  const [showScrollFade, setShowScrollFade] = useState(false);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;

    const SCROLL_BOTTOM_THRESHOLD_PX = 2;

    const checkScrollable = () => {
      const container = el.parentElement;
      if (container) {
        const isScrollable = container.scrollHeight > container.clientHeight;
        const isAtBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight <
          SCROLL_BOTTOM_THRESHOLD_PX;
        setShowScrollFade(isScrollable && !isAtBottom);
      }
    };

    checkScrollable();

    const container = el.parentElement;
    if (container) {
      container.addEventListener('scroll', checkScrollable, { passive: true });
    }
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(el);

    return () => {
      if (container) container.removeEventListener('scroll', checkScrollable);
      resizeObserver.disconnect();
    };
  }, [allSmells, filters]);

  // Track search queries for analytics (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) return;
    // 500ms serves two purposes: (1) debounce rapid typing, (2) wait for
    // $filteredSlugs derived store to settle after $searchQuery update.
    // Do not reduce below 300ms or result_count may read stale values.
    const timer = setTimeout(() => {
      trackEvent({
        name: 'catalog_search',
        params: { query: normalizeQuery(searchQuery), result_count: $filteredSlugs.get().size },
      });
    }, SEARCH_ANALYTICS_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sidebarContent = (
    <>
      <SearchInput />
      <FilterSummary
        filteredCount={filteredSlugs.size}
        totalCount={allSmells.length}
        activeFilterCount={activeCount}
        activeFilterLabels={activeFilterLabels}
        searchQuery={searchQuery}
        onClearAll={handleClearAll}
      />
      <ActivePills
        filters={filters}
        query={searchQuery}
        onRemoveFilter={handleToggle}
        onClearSearch={handleClearSearch}
      />

      {DIMENSION_CONFIG.map((dim) => (
        <DimensionSection
          key={dim.key}
          dimensionKey={dim.key}
          label={dim.label}
          color={dim.color}
          values={dimensionValues[dim.key]}
          activeValues={filters[dim.key]}
          counts={filterCounts[dim.key]}
          onToggle={(value) => handleToggle(dim.key, value)}
        />
      ))}

      {showEmpty && <EmptyState onClearAll={handleClearAll} />}
    </>
  );

  return (
    <>
      {/* Desktop: rendered in sidebar slot via CatalogLayout */}
      <div class="filter-sidebar__desktop" ref={desktopRef}>
        {sidebarContent}
        {showScrollFade && <div class="filter-sidebar__scroll-fade" />}
      </div>

      {/* Mobile: bottom sheet with FAB trigger */}
      <MobileBottomSheet activeCount={mobileBadgeCount}>{sidebarContent}</MobileBottomSheet>
    </>
  );
}

export default function FilterSidebar() {
  return (
    <FilterErrorBoundary>
      <FilterSidebarInner />
    </FilterErrorBoundary>
  );
}
