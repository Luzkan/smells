import { describe, expect, it } from 'vitest';
import { parseHTML } from 'linkedom';
import {
  applySearchHighlights,
  primeSearchHighlightCache,
} from '../../../src/lib/catalog/search-highlight';

function createCard() {
  const { document } = parseHTML(`
    <html>
      <body>
        <article class="smell-card">
          <h2 class="smell-card__title">
            <a class="smell-card__link" href="/smells/dead-code">
              <span class="smell-card__title-text">Dead Code</span>
            </a>
          </h2>
          <p class="smell-card__aliases">aka Zombie Code</p>
          <p class="smell-card__desc">Unused branches linger.</p>
        </article>
      </body>
    </html>
  `);

  const card = document.querySelector<HTMLElement>('.smell-card');
  if (!card) throw new Error('Missing card');

  return { card };
}

describe('search-highlight', () => {
  it('preserves the inner card link when title text is highlighted', () => {
    const { card } = createCard();

    primeSearchHighlightCache([card]);
    applySearchHighlights('dead', [card]);

    const link = card.querySelector<HTMLAnchorElement>('.smell-card__link');
    const titleText = card.querySelector<HTMLElement>('.smell-card__title-text');

    expect(link?.getAttribute('href')).toBe('/smells/dead-code');
    expect(titleText?.querySelector('mark.search-hl')?.textContent).toBe('Dead');
    expect(titleText?.textContent).toBe('Dead Code');
  });

  it('restores clean text when the query clears', () => {
    const { card } = createCard();

    primeSearchHighlightCache([card]);
    applySearchHighlights('dead', [card]);
    applySearchHighlights('', [card]);

    expect(card.querySelector('.smell-card__title-text')?.innerHTML).toBe('Dead Code');
    expect(card.querySelector('.smell-card__aliases')?.innerHTML).toBe('aka Zombie Code');
    expect(card.querySelector('.smell-card__desc')?.innerHTML).toBe('Unused branches linger.');
  });
});
