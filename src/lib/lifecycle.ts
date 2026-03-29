type Cleanup = () => void;

const swapCleanups = new Set<Cleanup>();
let hasSwapListener = false;

function runSwapCleanups(): void {
  for (const cleanup of swapCleanups) {
    try {
      cleanup();
    } catch {
      // Ignore cleanup failures to avoid breaking navigation.
    }
  }
  swapCleanups.clear();
}

function ensureSwapListener(): void {
  if (hasSwapListener || typeof document === 'undefined') return;
  document.addEventListener('astro:before-swap', runSwapCleanups);
  hasSwapListener = true;
}

function onSwap(cleanup: Cleanup): () => void {
  ensureSwapListener();
  swapCleanups.add(cleanup);
  return () => {
    swapCleanups.delete(cleanup);
  };
}

export function initOnce(selector: string, setup: (root: HTMLElement) => Cleanup | void): void {
  const seen = new WeakSet<HTMLElement>();

  function init(): void {
    const root = document.querySelector(selector);
    if (!(root instanceof HTMLElement) || seen.has(root)) return;
    seen.add(root);
    const teardown = setup(root);
    if (teardown) onSwap(teardown);
  }

  ensureSwapListener();
  init();
  document.addEventListener('astro:page-load', init);
}

export function initAll(selector: string, setup: (root: HTMLElement) => Cleanup | void): void {
  const seen = new WeakSet<HTMLElement>();

  function init(): void {
    const roots = document.querySelectorAll<HTMLElement>(selector);
    roots.forEach((root) => {
      if (seen.has(root)) return;
      seen.add(root);
      const teardown = setup(root);
      if (teardown) onSwap(teardown);
    });
  }

  ensureSwapListener();
  init();
  document.addEventListener('astro:page-load', init);
}
