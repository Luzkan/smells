export type ViewMode = 'grid' | 'list';

const GRID_LIST_CLASS = 'smell-grid--list';
const VIEW_ACTIVE_CLASS = 'grid-toolbar__view-btn--active';

interface ViewElements {
  grid: HTMLElement;
  viewGrid: HTMLElement | null;
  viewList: HTMLElement | null;
}

function applyView(els: ViewElements, mode: ViewMode): void {
  els.viewGrid?.setAttribute('aria-pressed', String(mode === 'grid'));
  els.viewList?.setAttribute('aria-pressed', String(mode === 'list'));

  if (mode === 'list') {
    els.grid.classList.add(GRID_LIST_CLASS);
    els.viewGrid?.classList.remove(VIEW_ACTIVE_CLASS);
    els.viewList?.classList.add(VIEW_ACTIVE_CLASS);
  } else {
    els.grid.classList.remove(GRID_LIST_CLASS);
    els.viewGrid?.classList.add(VIEW_ACTIVE_CLASS);
    els.viewList?.classList.remove(VIEW_ACTIVE_CLASS);
  }
}

/** User action — apply and persist to localStorage. */
export function setView(els: ViewElements, mode: ViewMode): void {
  applyView(els, mode);
  try {
    localStorage.setItem('catalog-view', mode);
  } catch {
    /* quota/security */
  }
}

/** Page load — apply without persisting (avoids infinite write loop). */
export function restoreView(els: ViewElements, mode: ViewMode): void {
  applyView(els, mode);
}
