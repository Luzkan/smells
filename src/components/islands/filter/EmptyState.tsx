interface EmptyStateProps {
  onClearAll: () => void;
}

export function EmptyState({ onClearAll }: EmptyStateProps) {
  return (
    <div class="filter-sidebar__empty">
      <div class="filter-sidebar__empty-icon" aria-hidden="true">
        &#128269;
      </div>
      <div class="filter-sidebar__empty-text">No matches found</div>
      <p class="filter-sidebar__empty-hint">Try removing some filters or adjusting your search.</p>
      <button type="button" class="filter-sidebar__empty-btn" onClick={onClearAll}>
        Clear all filters
      </button>
    </div>
  );
}
