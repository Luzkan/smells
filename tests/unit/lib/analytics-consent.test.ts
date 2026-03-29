import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { createLocalStorageMock, installGlobals } from '../fixtures';

vi.mock('../../../src/lib/analytics/tracker', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../src/lib/analytics/tracker')>();
  return {
    ...actual,
    trackPageView: vi.fn(),
  };
});

let cleanupGlobals: () => void;

function createConsentDocument() {
  return parseHTML(`
    <html>
      <head></head>
      <body>
        <aside id="analytics-consent" aria-hidden="true" inert>
          <button id="analytics-consent-allow" type="button">Allow analytics</button>
          <button id="analytics-consent-decline" type="button">No thanks</button>
        </aside>
        <button id="footer-analytics-preference-trigger" type="button">Analytics</button>
      </body>
    </html>
  `);
}

async function setupConsentManager(initialStorage: Record<string, string> = {}) {
  const { document, window } = createConsentDocument();
  const localStorage = createLocalStorageMock(initialStorage);

  cleanupGlobals = installGlobals({
    window,
    document,
    localStorage,
    location: window.location,
  });

  const analytics = await import('../../../src/lib/analytics/tracker');
  const consent = await import('../../../src/lib/analytics/consent');

  return { analytics, consent, document, localStorage, window };
}

describe('analytics-consent', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanupGlobals?.();
  });

  it('keeps GA disabled and reveals the banner without stored consent', async () => {
    const { analytics, consent, document, window } = await setupConsentManager();

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    expect(document.documentElement.getAttribute(consent.ANALYTICS_CONSENT_ATTRIBUTE)).toBe(
      consent.ANALYTICS_CONSENT_PENDING,
    );
    expect(typeof window.gtag).toBe('undefined');
    expect(document.getElementById('ga4-consent-script')).toBeNull();
    expect(document.getElementById('analytics-consent')?.getAttribute('aria-hidden')).toBe('false');
    expect(document.getElementById('analytics-consent')?.hasAttribute('inert')).toBe(false);
    expect(analytics.trackPageView).not.toHaveBeenCalled();
  });

  it('keeps GA disabled when stored consent is denied', async () => {
    const { analytics, consent, document, window } = await setupConsentManager({
      'analytics-consent': 'denied',
    });

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    expect(document.documentElement.getAttribute(consent.ANALYTICS_CONSENT_ATTRIBUTE)).toBe(
      consent.ANALYTICS_CONSENT_DENIED,
    );
    expect(typeof window.gtag).toBe('undefined');
    expect(document.getElementById('ga4-consent-script')).toBeNull();
    expect(document.getElementById('analytics-consent')?.getAttribute('aria-hidden')).toBe('true');
    expect(document.getElementById('analytics-consent')?.hasAttribute('inert')).toBe(true);
    expect(analytics.trackPageView).not.toHaveBeenCalled();
  });

  it('boots GA from stored granted consent without manually tracking the first page view', async () => {
    const { analytics, consent, document, window } = await setupConsentManager({
      'analytics-consent': 'granted',
    });

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    const script = document.getElementById('ga4-consent-script');
    expect(document.documentElement.getAttribute(consent.ANALYTICS_CONSENT_ATTRIBUTE)).toBe(
      consent.ANALYTICS_CONSENT_GRANTED,
    );
    expect(typeof window.gtag).toBe('function');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123456',
    );
    expect(analytics.trackPageView).not.toHaveBeenCalled();
  });

  it('accept persists consent, boots GA, and tracks the current page exactly once', async () => {
    const { analytics, consent, document, localStorage, window } = await setupConsentManager();

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    const allowButton = document.getElementById('analytics-consent-allow');
    if (!(allowButton instanceof window.HTMLButtonElement)) {
      throw new TypeError('Missing allow button');
    }

    allowButton.dispatchEvent(new window.Event('click', { bubbles: true }));

    expect(localStorage.setItem).toHaveBeenCalledWith('analytics-consent', 'granted');
    expect(document.documentElement.getAttribute(consent.ANALYTICS_CONSENT_ATTRIBUTE)).toBe(
      consent.ANALYTICS_CONSENT_GRANTED,
    );
    expect(typeof window.gtag).toBe('function');
    expect(document.querySelectorAll('#ga4-consent-script')).toHaveLength(1);
    expect(analytics.trackPageView).toHaveBeenCalledTimes(1);
  });

  it('decline persists a disabled state without bootstrapping GA', async () => {
    const { analytics, consent, document, localStorage, window } = await setupConsentManager();

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    const declineButton = document.getElementById('analytics-consent-decline');
    if (!(declineButton instanceof window.HTMLButtonElement)) {
      throw new TypeError('Missing decline button');
    }

    declineButton.dispatchEvent(new window.Event('click', { bubbles: true }));

    expect(localStorage.setItem).toHaveBeenCalledWith('analytics-consent', 'denied');
    expect(document.documentElement.getAttribute(consent.ANALYTICS_CONSENT_ATTRIBUTE)).toBe(
      consent.ANALYTICS_CONSENT_DENIED,
    );
    expect(document.getElementById('ga4-consent-script')).toBeNull();
    expect(analytics.trackPageView).not.toHaveBeenCalled();
  });

  it('guards against duplicate initialization', async () => {
    const { analytics, consent, document, window } = await setupConsentManager();

    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });
    consent.initAnalyticsConsentManager({ trackingId: 'G-TEST123456' });

    const allowButton = document.getElementById('analytics-consent-allow');
    if (!(allowButton instanceof window.HTMLButtonElement)) {
      throw new TypeError('Missing allow button');
    }

    allowButton.dispatchEvent(new window.Event('click', { bubbles: true }));

    expect(document.querySelectorAll('#ga4-consent-script')).toHaveLength(1);
    expect(analytics.trackPageView).toHaveBeenCalledTimes(1);
  });
});
