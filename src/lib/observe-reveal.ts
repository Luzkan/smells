/**
 * Observe an element until it intersects, then disconnect and run a callback.
 *
 * Useful for one-shot reveal animations in inline Astro scripts.
 */
export interface StaggerRevealTarget {
  el: Element | null | undefined;
  delayMs?: number;
  className?: string;
  onReveal?: () => void | (() => void);
}

export function observeReveal(
  el: Element,
  onReveal: () => void,
  options?: IntersectionObserverInit,
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;

    observer.disconnect();
    onReveal();
  }, options);

  observer.observe(el);
  return observer;
}

/**
 * Reveal a series of elements after a sentinel intersects.
 *
 * Each target gets a `className` (default: `revealed`) after its optional delay.
 * Targets can also run an `onReveal` callback and return a cleanup.
 */
export function staggerReveal(
  sentinel: Element,
  targets: readonly StaggerRevealTarget[],
  options?: IntersectionObserverInit,
): () => void {
  const timeoutIds = new Set<ReturnType<typeof globalThis.setTimeout>>();
  const revealCleanups = new Set<() => void>();

  const observer = observeReveal(
    sentinel,
    () => {
      targets.forEach(({ el, delayMs = 0, className = 'revealed', onReveal }) => {
        if (!el) return;

        const reveal = () => {
          if (className) {
            el.classList.add(className);
          }

          const cleanup = onReveal?.();
          if (cleanup) {
            revealCleanups.add(cleanup);
          }
        };

        if (delayMs <= 0) {
          reveal();
          return;
        }

        const timeoutId = globalThis.setTimeout(() => {
          timeoutIds.delete(timeoutId);
          reveal();
        }, delayMs);
        timeoutIds.add(timeoutId);
      });
    },
    options,
  );

  return () => {
    observer.disconnect();
    timeoutIds.forEach((timeoutId) => globalThis.clearTimeout(timeoutId));
    timeoutIds.clear();
    revealCleanups.forEach((cleanup) => cleanup());
    revealCleanups.clear();
  };
}
