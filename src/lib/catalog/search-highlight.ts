/**
 * Highlights search query matches inside catalog card text.
 *
 * Walks each card's title text, aliases, and description, wrapping
 * matching substrings with <mark class="search-hl">. Original text is
 * cached in a `data-original` attribute so highlights can be cleanly
 * removed without disturbing any surrounding markup.
 *
 * NOTE: Category sort reads `CARD_TITLE_SELECTOR` textContent, so the
 * title selector intentionally targets the dedicated title-text span
 * rather than the whole heading/link wrapper.
 */

import { CARD_TITLE_SELECTOR, CARD_ALIASES_SELECTOR, CARD_DESC_SELECTOR } from './card-selectors';
import { escapeHtml, escapeRegex } from '../string-utils';

const HIGHLIGHT_SELECTORS = [
  CARD_TITLE_SELECTOR,
  CARD_ALIASES_SELECTOR,
  CARD_DESC_SELECTOR,
] as const;

const MIN_QUERY_LENGTH = 2;

function cacheOriginalText(el: HTMLElement): void {
  if (!('original' in el.dataset)) {
    el.dataset.original = el.textContent ?? '';
  }
}

function highlightElement(el: HTMLElement, query: string): void {
  cacheOriginalText(el);

  const original = el.dataset.original ?? '';

  if (!query || query.length < MIN_QUERY_LENGTH) {
    el.textContent = original;
    return;
  }

  const escaped = escapeRegex(query);
  const regex = new RegExp(`(${escaped})`, 'gi');
  const safe = escapeHtml(original);
  el.innerHTML = safe.replace(regex, '<mark class="search-hl">$1</mark>');
}

export function primeSearchHighlightCache(cards: NodeListOf<HTMLElement> | HTMLElement[]): void {
  for (const card of cards) {
    for (const selector of HIGHLIGHT_SELECTORS) {
      const el = card.querySelector<HTMLElement>(selector);
      if (!el) continue;
      cacheOriginalText(el);
    }
  }
}

export function applySearchHighlights(
  query: string,
  cards: NodeListOf<HTMLElement> | HTMLElement[],
): void {
  const q = query.trim();

  for (const card of cards) {
    for (const selector of HIGHLIGHT_SELECTORS) {
      const el = card.querySelector<HTMLElement>(selector);
      if (!el) continue;
      highlightElement(el, q);
    }
  }
}
