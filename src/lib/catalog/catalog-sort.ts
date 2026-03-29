/**
 * Catalog sort logic — pure data transformations + DOM fragment creation.
 * No direct DOM reads; receives data, returns ordered results.
 */

import { CARD_SLUG_ATTR, CARD_OBSTRUCTION_ATTR, CARD_TITLE_SELECTOR } from './card-selectors';
import { escapeHtml } from '../string-utils';
import { OBSTRUCTION_CATEGORIES, type ObstructionCategory } from '../constants';

const OBSTRUCTION_SET: ReadonlySet<string> = new Set(OBSTRUCTION_CATEGORIES);

function isObstructionCategory(v: string): v is ObstructionCategory {
  return OBSTRUCTION_SET.has(v);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export type SortMode = 'alpha' | 'category';

export type CategoryGroup = {
  name: ObstructionCategory;
  color: string;
  slugs: string[];
};

const CATEGORY_GROUPS_DATA_ID = 'category-groups-data';

export function parseCategoryGroups(doc: Document): CategoryGroup[] {
  const groupsEl = doc.getElementById(CATEGORY_GROUPS_DATA_ID);
  if (!groupsEl) return [];

  try {
    const parsed: unknown = JSON.parse(groupsEl.textContent || '[]');
    if (!Array.isArray(parsed)) return [];
    const parsedArray: unknown[] = parsed;

    return parsedArray
      .filter(
        (item): item is { name: string; color: string; slugs: unknown[] } =>
          isRecord(item) &&
          typeof item.name === 'string' &&
          typeof item.color === 'string' &&
          Array.isArray(item.slugs),
      )
      .map((item) => ({
        name: isObstructionCategory(item.name) ? item.name : 'Other',
        color: item.color,
        slugs: item.slugs.filter((s): s is string => typeof s === 'string'),
      }));
  } catch (error) {
    console.error('[catalog-sort] category sort data parse error:', error);
    return [];
  }
}

function computeSortOrder(categoryGroups: CategoryGroup[]): Map<string, number> {
  return new Map(categoryGroups.flatMap((group) => group.slugs).map((slug, i) => [slug, i]));
}

function createCategoryHeader(doc: Document, categoryName: string, color: string): HTMLDivElement {
  const header = doc.createElement('div');
  header.className = 'category-group-header';
  header.style.setProperty('--cat-color', color);
  const safeCategoryName = escapeHtml(categoryName);
  header.innerHTML =
    '<span class="category-group-header__bar"></span>' +
    `<span class="category-group-header__label">${safeCategoryName}</span>`;
  return header;
}

export function applyCategorySort(
  doc: Document,
  grid: HTMLElement,
  cards: NodeListOf<HTMLElement>,
  categoryGroups: CategoryGroup[],
): void {
  const slugOrder = computeSortOrder(categoryGroups);
  const cardArr = Array.from(cards);

  cardArr.sort((a, b) => {
    const aOrder = slugOrder.get(a.getAttribute(CARD_SLUG_ATTR) || '') ?? Number.MAX_SAFE_INTEGER;
    const bOrder = slugOrder.get(b.getAttribute(CARD_SLUG_ATTR) || '') ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });

  let currentCategory = '';
  for (const card of cardArr) {
    const cardCategory = card.getAttribute(CARD_OBSTRUCTION_ATTR) || 'Other';
    if (cardCategory !== currentCategory) {
      currentCategory = cardCategory;
      const group = categoryGroups.find((entry) => entry.name === currentCategory);
      const color = group ? group.color : 'var(--accent)';
      grid.appendChild(createCategoryHeader(doc, currentCategory, color));
    }
    grid.appendChild(card);
  }
}

const LEADING_NON_ALPHA = /^[^a-zA-Z0-9]+/;

export function applyAlphaSort(grid: HTMLElement, cards: NodeListOf<HTMLElement>): void {
  const cardArr = Array.from(cards);
  cardArr.sort((a, b) => {
    const aTitle = (a.querySelector(CARD_TITLE_SELECTOR)?.textContent || '').replace(
      LEADING_NON_ALPHA,
      '',
    );
    const bTitle = (b.querySelector(CARD_TITLE_SELECTOR)?.textContent || '').replace(
      LEADING_NON_ALPHA,
      '',
    );
    return aTitle.localeCompare(bTitle);
  });
  for (const card of cardArr) {
    grid.appendChild(card);
  }
}
