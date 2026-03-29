/**
 * Catalog toolbar orchestrator — composes sort and view modules,
 * manages event listeners, and aggregates cleanup for View Transitions.
 */

import { trackEvent } from '../analytics/tracker';
import { CARD_SELECTOR } from './card-selectors';
import {
  parseCategoryGroups,
  applyCategorySort,
  applyAlphaSort,
  type SortMode,
} from './catalog-sort';
import { setView, restoreView } from './catalog-view';

const GRID_ID = 'grid';
const SORT_ALPHA_ID = 'sort-alpha';
const SORT_CATEGORY_ID = 'sort-category';
const VIEW_GRID_ID = 'view-grid';
const VIEW_LIST_ID = 'view-list';

const GRID_CATEGORY_CLASS = 'smell-grid--category-sort';
const CATEGORY_GROUP_HEADER_SELECTOR = '.category-group-header';
const SORT_ACTIVE_CLASS = 'grid-toolbar__sort-btn--active';

const SEARCH_INPUT_SELECTOR = '.filter-sidebar__search-input';
const SEARCH_FOCUS_RETRIES = 8;
const SEARCH_FOCUS_RETRY_MS = 250;

export function initCatalogToolbar(doc: Document): () => void {
  const grid = doc.getElementById(GRID_ID);
  if (!grid) return () => {};
  return setupToolbar(doc, grid);
}

function setupToolbar(doc: Document, grid: HTMLElement): () => void {
  const sortAlpha = doc.getElementById(SORT_ALPHA_ID);
  const sortCategory = doc.getElementById(SORT_CATEGORY_ID);
  const viewGrid = doc.getElementById(VIEW_GRID_ID);
  const viewList = doc.getElementById(VIEW_LIST_ID);
  const categoryGroups = parseCategoryGroups(doc);

  const viewEls = { grid, viewGrid, viewList };

  let searchFocusTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  const cleanupFns: Array<() => void> = [];
  let cleanedUp = false;

  function applySort(mode: SortMode): void {
    const cards = grid.querySelectorAll<HTMLElement>(CARD_SELECTOR);
    grid.querySelectorAll(CATEGORY_GROUP_HEADER_SELECTOR).forEach((h) => h.remove());

    sortAlpha?.setAttribute('aria-pressed', String(mode === 'alpha'));
    sortCategory?.setAttribute('aria-pressed', String(mode === 'category'));

    if (mode === 'category') {
      grid.classList.add(GRID_CATEGORY_CLASS);
      sortAlpha?.classList.remove(SORT_ACTIVE_CLASS);
      sortCategory?.classList.add(SORT_ACTIVE_CLASS);
      applyCategorySort(doc, grid, cards, categoryGroups);
    } else {
      grid.classList.remove(GRID_CATEGORY_CLASS);
      sortAlpha?.classList.add(SORT_ACTIVE_CLASS);
      sortCategory?.classList.remove(SORT_ACTIVE_CLASS);
      applyAlphaSort(grid, cards);
    }
  }

  function setSort(mode: SortMode): void {
    applySort(mode);
    try {
      localStorage.setItem('catalog-sort', mode);
    } catch {
      /* quota/security */
    }
  }

  function focusSidebarSearchInput(retriesRemaining: number): void {
    const sidebarInput = doc.querySelector<HTMLElement>(SEARCH_INPUT_SELECTOR);
    if (sidebarInput) {
      sidebarInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sidebarInput.focus();
      return;
    }
    if (retriesRemaining <= 0) return;
    searchFocusTimer = globalThis.setTimeout(() => {
      focusSidebarSearchInput(retriesRemaining - 1);
    }, SEARCH_FOCUS_RETRY_MS);
  }

  function registerClick(el: HTMLElement | null, handler: () => void): void {
    if (!el) return;
    el.addEventListener('click', handler);
    cleanupFns.push(() => el.removeEventListener('click', handler));
  }

  registerClick(viewGrid, () => {
    setView(viewEls, 'grid');
    trackEvent({ name: 'view_change', params: { view: 'grid' } });
  });
  registerClick(viewList, () => {
    setView(viewEls, 'list');
    trackEvent({ name: 'view_change', params: { view: 'list' } });
  });
  registerClick(sortAlpha, () => {
    setSort('alpha');
    trackEvent({ name: 'sort_change', params: { sort: 'alpha' } });
  });
  registerClick(sortCategory, () => {
    setSort('category');
    trackEvent({ name: 'sort_change', params: { sort: 'category' } });
  });

  try {
    const savedView = localStorage.getItem('catalog-view');
    restoreView(viewEls, savedView === 'list' ? 'list' : 'grid');

    const savedSort = localStorage.getItem('catalog-sort');
    applySort(savedSort === 'category' ? 'category' : 'alpha');
  } catch {
    restoreView(viewEls, 'grid');
    applySort('alpha');
  }

  if ((globalThis.location?.hash ?? '') === '#search') {
    focusSidebarSearchInput(SEARCH_FOCUS_RETRIES);
  }

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    for (const fn of cleanupFns) fn();
    if (searchFocusTimer !== null) {
      globalThis.clearTimeout(searchFocusTimer);
      searchFocusTimer = null;
    }
  };

  doc.addEventListener('astro:before-swap', cleanup, { once: true });
  return cleanup;
}
