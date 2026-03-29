/**
 * Shows/hides cards by mutating the DOM based on the filtered slug set.
 *
 * - Empty set with no smells data = show all cards (pre-init state).
 * - Otherwise toggle .hidden class and add .card-entering for reveal animation.
 * - Updates the live region text for screen readers.
 */
import { CARD_SLUG_ATTR, CARD_REVEAL_ANIMATION } from './card-selectors';

const pendingRevealHandlers = new WeakMap<HTMLElement, (event: AnimationEvent) => void>();

function clearPendingRevealHandler(card: HTMLElement): void {
  const handler = pendingRevealHandlers.get(card);
  if (handler) {
    card.removeEventListener('animationend', handler);
    pendingRevealHandlers.delete(card);
  }
}

export function applyCardVisibility(
  slugs: Set<string>,
  cards: NodeListOf<HTMLElement> | HTMLElement[],
  liveRegion: HTMLElement | null,
): void {
  let visibleIndex = 0;
  for (const card of cards) {
    const slug = card.getAttribute(CARD_SLUG_ATTR);
    if (!slug) continue;

    const wasHidden = card.classList.contains('hidden');
    const shouldShow = slugs.has(slug);

    if (shouldShow) {
      card.classList.remove('hidden');
      if (wasHidden) {
        clearPendingRevealHandler(card);
        card.classList.add('card-entering');
        card.style.setProperty('--card-index', String(visibleIndex));
        const handler = (e: AnimationEvent) => {
          if (e.animationName === CARD_REVEAL_ANIMATION) {
            card.classList.remove('card-entering');
            clearPendingRevealHandler(card);
          }
        };
        pendingRevealHandlers.set(card, handler);
        card.addEventListener('animationend', handler);
      }
      visibleIndex++;
    } else {
      clearPendingRevealHandler(card);
      card.classList.add('hidden');
      card.classList.remove('card-entering');
    }
  }

  if (liveRegion) {
    liveRegion.textContent = `${slugs.size} smell${slugs.size === 1 ? '' : 's'} shown`;
  }
}
