import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { applyCardVisibility } from '../../../src/lib/catalog/card-visibility';
import { CARD_REVEAL_ANIMATION } from '../../../src/lib/catalog/card-selectors';

function createDOM(cardSlugs: string[]) {
  const html = `
    <html>
      <body>
        <div id="grid">
          ${cardSlugs.map((slug) => `<div class="smell-card" data-slug="${slug}"></div>`).join('\n')}
        </div>
        <div id="filter-results-live" role="status" aria-live="polite"></div>
      </body>
    </html>
  `;
  const { document } = parseHTML(html);
  return document;
}

describe('applyCardVisibility', () => {
  it('shows zero smells when set is empty (pre-init or zero results)', () => {
    const doc = createDOM(['a', 'b', 'c']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');
    const liveRegion = doc.getElementById('filter-results-live');

    if (!liveRegion) throw new Error('Missing live region');

    applyCardVisibility(new Set(), cards, liveRegion);

    expect(cards[0].classList.contains('hidden')).toBe(true);
    expect(liveRegion.textContent).toBe('0 smells shown');
  });

  it('hides cards not in the filtered set', () => {
    const doc = createDOM(['a', 'b', 'c']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');
    const liveRegion = doc.getElementById('filter-results-live');

    if (!liveRegion) throw new Error('Missing live region');

    applyCardVisibility(new Set(['a', 'c']), cards, liveRegion);

    expect(cards[0].classList.contains('hidden')).toBe(false);
    expect(cards[1].classList.contains('hidden')).toBe(true);
    expect(cards[2].classList.contains('hidden')).toBe(false);
  });

  it('updates live region text with correct count', () => {
    const doc = createDOM(['a', 'b', 'c']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');
    const liveRegion = doc.getElementById('filter-results-live');

    if (!liveRegion) throw new Error('Missing live region');

    applyCardVisibility(new Set(['a']), cards, liveRegion);
    expect(liveRegion.textContent).toBe('1 smell shown');

    applyCardVisibility(new Set(['a', 'b']), cards, liveRegion);
    expect(liveRegion.textContent).toBe('2 smells shown');
  });

  it('adds card-entering class when a hidden card becomes visible', () => {
    const doc = createDOM(['a', 'b']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');

    // First hide card 'b'
    cards[1].classList.add('hidden');

    applyCardVisibility(new Set(['a', 'b']), cards, null);

    expect(cards[1].classList.contains('card-entering')).toBe(true);
  });

  it('removes pending reveal listeners when a card is hidden mid-animation', () => {
    const doc = createDOM(['a']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');
    const card = cards[0];
    card.classList.add('hidden');

    const addSpy = vi.spyOn(card, 'addEventListener');
    const removeSpy = vi.spyOn(card, 'removeEventListener');

    applyCardVisibility(new Set(['a']), cards, null);

    const firstHandler = addSpy.mock.calls.find(([type]) => type === 'animationend')?.[1] as
      | ((event: AnimationEvent) => void)
      | undefined;

    if (!firstHandler) {
      throw new Error('Missing initial animationend handler');
    }

    applyCardVisibility(new Set(), cards, null);

    expect(card.classList.contains('hidden')).toBe(true);
    expect(card.classList.contains('card-entering')).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('animationend', firstHandler);

    applyCardVisibility(new Set(['a']), cards, null);

    const animationHandlers = addSpy.mock.calls
      .filter(([type]) => type === 'animationend')
      .map(([, handler]) => handler as (event: AnimationEvent) => void);
    const secondHandler = animationHandlers.at(-1);

    if (!secondHandler) {
      throw new Error('Missing replacement animationend handler');
    }

    expect(secondHandler).not.toBe(firstHandler);

    secondHandler({ animationName: CARD_REVEAL_ANIMATION } as AnimationEvent);

    expect(card.classList.contains('card-entering')).toBe(false);
    expect(removeSpy).toHaveBeenCalledWith('animationend', secondHandler);
  });

  it('sets --card-index CSS custom property for stagger animation', () => {
    const doc = createDOM(['a', 'b', 'c']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');

    // Hide all cards first
    for (const card of cards) card.classList.add('hidden');

    applyCardVisibility(new Set(['a', 'b', 'c']), cards, null);

    expect(cards[0].style.getPropertyValue('--card-index')).toBe('0');
    expect(cards[1].style.getPropertyValue('--card-index')).toBe('1');
    expect(cards[2].style.getPropertyValue('--card-index')).toBe('2');
  });

  it('handles empty filtered set (zero results)', () => {
    const doc = createDOM(['a', 'b']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');
    const liveRegion = doc.getElementById('filter-results-live');

    if (!liveRegion) throw new Error('Missing live region');

    applyCardVisibility(new Set(), cards, liveRegion);

    expect(cards[0].classList.contains('hidden')).toBe(true);
    expect(cards[1].classList.contains('hidden')).toBe(true);
    expect(liveRegion.textContent).toBe('0 smells shown');
  });

  it('works without a live region (null)', () => {
    const doc = createDOM(['a']);
    const cards = doc.querySelectorAll<HTMLElement>('.smell-card');

    // Should not throw
    applyCardVisibility(new Set(['a']), cards, null);
    expect(cards[0].classList.contains('hidden')).toBe(false);
  });
});
