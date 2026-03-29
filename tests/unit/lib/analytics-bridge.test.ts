import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { installGlobals } from '../fixtures';

vi.mock('../../../src/lib/analytics/tracker', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/lib/analytics/tracker')>();
  return {
    ...actual,
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
  };
});

let cleanupGlobals: () => void;

async function setupBridge() {
  const { document, window } = parseHTML('<html><body></body></html>');

  cleanupGlobals = installGlobals({ window, document });

  const analytics = await import('../../../src/lib/analytics/tracker');
  const { initAnalyticsBridge } = await import('../../../src/lib/analytics/bridge');
  initAnalyticsBridge();

  return { document, window, analytics };
}

describe('analytics-bridge', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanupGlobals?.();
  });

  it('forwards analytics CustomEvent payloads to trackEvent()', async () => {
    const { document, window, analytics } = await setupBridge();

    document.dispatchEvent(
      new window.CustomEvent('analytics', {
        detail: { name: 'copy_link', params: { smell: 'dead-code' } },
      }),
    );

    expect(analytics.trackEvent).toHaveBeenCalledWith({
      name: 'copy_link',
      params: { smell: 'dead-code' },
    });
  });

  it('calls trackPageView() on astro:page-load', async () => {
    const { document, window, analytics } = await setupBridge();

    document.dispatchEvent(new window.Event('astro:page-load'));
    expect(analytics.trackPageView).toHaveBeenCalledTimes(1);
  });

  it('blocks unknown event names at the bridge boundary', async () => {
    const { document, window, analytics } = await setupBridge();

    try {
      document.dispatchEvent(
        new window.CustomEvent('analytics', {
          detail: { name: 'unknown_event', params: {} },
        }),
      );
    } catch {
      // DEV mode intentionally throws for invalid analytics events.
    }

    expect(analytics.trackEvent).not.toHaveBeenCalled();
  });
});
