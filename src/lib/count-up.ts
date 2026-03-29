/**
 * Count-up animation for elements with `data-target` (+ optional
 * `data-prefix` / `data-suffix`). Respects prefers-reduced-motion.
 */

interface CountUpOptions {
  duration?: number;
  baseDelay?: number;
  stagger?: number;
}

export function animateCountUp(container: Element, options: CountUpOptions = {}): () => void {
  const { duration = 800, baseDelay = 100, stagger = 100 } = options;
  const els = container.querySelectorAll<HTMLElement>('[data-target]');
  const timeoutIds = new Set<ReturnType<typeof globalThis.setTimeout>>();
  const frameIds = new Set<number>();
  let cancelled = false;

  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => {
      const prefix = el.dataset.prefix ?? '';
      const suffix = el.dataset.suffix ?? '';
      el.textContent = `${prefix}${el.dataset.target ?? '0'}${suffix}`;
    });
    return () => {};
  }

  els.forEach((el, i) => {
    const target = Number.parseInt(el.dataset.target ?? '', 10);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    if (Number.isNaN(target) || target === 0) return;

    el.textContent = `${prefix}0${suffix}`;

    const timeoutId = globalThis.setTimeout(
      () => {
        timeoutIds.delete(timeoutId);
        if (cancelled) return;

        const start = performance.now();

        function tick(now: number) {
          if (cancelled) return;

          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${prefix}${Math.round(target * eased)}${progress >= 1 ? suffix : ''}`;

          if (progress < 1) {
            const frameId = globalThis.requestAnimationFrame(tick);
            frameIds.add(frameId);
          }
        }

        const frameId = globalThis.requestAnimationFrame(tick);
        frameIds.add(frameId);
      },
      baseDelay + i * stagger,
    );
    timeoutIds.add(timeoutId);
  });

  return () => {
    cancelled = true;
    timeoutIds.forEach((timeoutId) => globalThis.clearTimeout(timeoutId));
    timeoutIds.clear();
    frameIds.forEach((frameId) => globalThis.cancelAnimationFrame(frameId));
    frameIds.clear();
  };
}
