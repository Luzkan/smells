import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initCatalogToolbar } from '../../../src/lib/catalog/catalog-toolbar';
import { trackEvent } from '../../../src/lib/analytics/tracker';
import { installGlobals, createLocalStorageMock } from '../fixtures';

vi.mock('../../../src/lib/analytics/tracker', () => ({
  trackEvent: vi.fn(),
}));

function createToolbarDocument() {
  const categoryGroups = [
    { name: 'Bloaters', color: 'rgb(255, 0, 0)', slugs: ['a', 'b'] },
    { name: 'Couplers', color: 'rgb(0, 0, 255)', slugs: ['c'] },
  ];

  const html = `
    <html>
      <body>
        <button id="sort-alpha" class="grid-toolbar__sort-btn grid-toolbar__sort-btn--active"></button>
        <button id="sort-category" class="grid-toolbar__sort-btn"></button>
        <button id="view-grid" class="grid-toolbar__view-btn grid-toolbar__view-btn--active"></button>
        <button id="view-list" class="grid-toolbar__view-btn"></button>
        <div id="grid">
          <article class="smell-card" data-slug="b" data-obstruction="Bloaters">
            <h2 class="smell-card__title"><a class="smell-card__link" href="/smells/b"><span class="smell-card__title-text">Beta smell</span></a></h2>
          </article>
          <article class="smell-card" data-slug="a" data-obstruction="Bloaters">
            <h2 class="smell-card__title"><a class="smell-card__link" href="/smells/a"><span class="smell-card__title-text">Alpha smell</span></a></h2>
          </article>
          <article class="smell-card" data-slug="c" data-obstruction="Couplers">
            <h2 class="smell-card__title"><a class="smell-card__link" href="/smells/c"><span class="smell-card__title-text">Coupling smell</span></a></h2>
          </article>
        </div>
        <script id="category-groups-data" type="application/json">${JSON.stringify(categoryGroups)}</script>
        <input class="filter-sidebar__search-input" />
      </body>
    </html>
  `;

  return parseHTML(html);
}

describe('initCatalogToolbar', () => {
  let cleanup: () => void;

  afterEach(() => {
    cleanup?.();
    vi.restoreAllMocks();
  });

  it('restores saved view/sort preferences and reorders cards', () => {
    const { document, window } = createToolbarDocument();
    const localStorage = createLocalStorageMock({
      'catalog-view': 'list',
      'catalog-sort': 'category',
    });

    cleanup = installGlobals({ window, document, localStorage, location: { hash: '' } });

    initCatalogToolbar(document);

    const grid = document.getElementById('grid');
    if (!grid) throw new Error('Missing grid element');
    expect(grid.classList.contains('smell-grid--list')).toBe(true);
    expect(grid.classList.contains('smell-grid--category-sort')).toBe(true);

    const sortCategory = document.getElementById('sort-category');
    const sortAlpha = document.getElementById('sort-alpha');
    if (!sortCategory || !sortAlpha) throw new Error('Missing sort buttons');
    expect(sortCategory.classList.contains('grid-toolbar__sort-btn--active')).toBe(true);
    expect(sortAlpha.classList.contains('grid-toolbar__sort-btn--active')).toBe(false);

    const orderedSlugs = Array.from(document.querySelectorAll<HTMLElement>('.smell-card')).map(
      (card) => card.dataset.slug,
    );
    expect(orderedSlugs).toEqual(['a', 'b', 'c']);
    expect(document.querySelectorAll('.category-group-header').length).toBeGreaterThan(0);
  });

  it('tracks and persists interactions for view/sort buttons', () => {
    const { document, window } = createToolbarDocument();
    const localStorage = createLocalStorageMock({});

    cleanup = installGlobals({ window, document, localStorage, location: { hash: '' } });

    initCatalogToolbar(document);

    const viewList = document.getElementById('view-list');
    const sortCategory = document.getElementById('sort-category');
    if (!viewList || !sortCategory) throw new Error('Missing toolbar buttons');

    viewList.dispatchEvent(new window.Event('click', { bubbles: true }));
    sortCategory.dispatchEvent(new window.Event('click', { bubbles: true }));

    expect(trackEvent).toHaveBeenNthCalledWith(1, {
      name: 'view_change',
      params: { view: 'list' },
    });
    expect(trackEvent).toHaveBeenNthCalledWith(2, {
      name: 'sort_change',
      params: { sort: 'category' },
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('catalog-view', 'list');
    expect(localStorage.setItem).toHaveBeenCalledWith('catalog-sort', 'category');
  });

  it('focuses sidebar search input when hash is #search', () => {
    const { document, window } = createToolbarDocument();
    const localStorage = createLocalStorageMock({});

    cleanup = installGlobals({ window, document, localStorage, location: { hash: '#search' } });

    const input = document.querySelector<HTMLElement>('.filter-sidebar__search-input');
    if (!input) throw new Error('Missing search input');
    const scrollIntoView = vi.fn();
    const focus = vi.fn();
    input.scrollIntoView = scrollIntoView;
    input.focus = focus;

    initCatalogToolbar(document);

    expect(scrollIntoView).toHaveBeenCalled();
    expect(focus).toHaveBeenCalled();
  });
});
