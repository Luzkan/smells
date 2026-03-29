import { trackPageView } from './tracker';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'analytics-consent';
export const ANALYTICS_CONSENT_ATTRIBUTE = 'data-analytics-consent';
export const ANALYTICS_CONSENT_PENDING = 'pending';
export const ANALYTICS_CONSENT_GRANTED = 'granted';
export const ANALYTICS_CONSENT_DENIED = 'denied';

const ANALYTICS_CONSENT_SCRIPT_ID = 'ga4-consent-script';
const ANALYTICS_CONSENT_ROOT_ID = 'analytics-consent';
const ANALYTICS_CONSENT_ALLOW_ID = 'analytics-consent-allow';
const ANALYTICS_CONSENT_DECLINE_ID = 'analytics-consent-decline';
const ANALYTICS_CONSENT_RESET_ID = 'footer-analytics-preference-trigger';

export type AnalyticsConsentState =
  | typeof ANALYTICS_CONSENT_GRANTED
  | typeof ANALYTICS_CONSENT_DENIED;

type AnalyticsConsentDocumentState = AnalyticsConsentState | typeof ANALYTICS_CONSENT_PENDING;

interface InitAnalyticsConsentManagerOptions {
  trackingId?: string;
}

let initialized = false;
let gaBootstrapped = false;

function isAnalyticsConsentState(value: string | null): value is AnalyticsConsentState {
  return value === ANALYTICS_CONSENT_GRANTED || value === ANALYTICS_CONSENT_DENIED;
}

function setDocumentConsentState(state: AnalyticsConsentDocumentState): void {
  document.documentElement.setAttribute(ANALYTICS_CONSENT_ATTRIBUTE, state);

  const root = document.getElementById(ANALYTICS_CONSENT_ROOT_ID);
  if (!(root instanceof globalThis.window.HTMLElement)) return;

  const isPending = state === ANALYTICS_CONSENT_PENDING;
  root.setAttribute('aria-hidden', String(!isPending));

  if (isPending) {
    root.removeAttribute('inert');
    return;
  }

  root.setAttribute('inert', '');
}

function ensureDataLayer(): void {
  globalThis.window.dataLayer = globalThis.window.dataLayer || [];
}

function ensureGtagStub(): void {
  if (typeof globalThis.window.gtag === 'function') return;

  function gtag() {
    // Google tag expects the native arguments object shape in dataLayer.
    // eslint-disable-next-line prefer-rest-params
    globalThis.window.dataLayer?.push(arguments);
  }

  globalThis.window.gtag = gtag;
}

function ensureGoogleTagScript(trackingId: string): void {
  if (document.getElementById(ANALYTICS_CONSENT_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = ANALYTICS_CONSENT_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.append(script);
}

function bootstrapGoogleAnalytics(trackingId: string): void {
  if (gaBootstrapped) return;

  ensureDataLayer();
  ensureGtagStub();

  globalThis.window.gtag?.('js', new Date());
  globalThis.window.gtag?.('config', trackingId, { send_page_view: false });
  ensureGoogleTagScript(trackingId);

  gaBootstrapped = true;
}

function persistAnalyticsConsent(state: AnalyticsConsentState): void {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, state);
  } catch {
    // Ignore storage failures in private browsing/security-restricted contexts.
  }
}

export function readAnalyticsConsent(): AnalyticsConsentState | null {
  if (globalThis.window === undefined) return null;

  try {
    const stored = localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return isAnalyticsConsentState(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function clearAnalyticsConsent(): void {
  try {
    localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
  } catch {
    // Ignore storage failures in private browsing/security-restricted contexts.
  }
}

export function denyAnalyticsConsent(): void {
  persistAnalyticsConsent(ANALYTICS_CONSENT_DENIED);
  setDocumentConsentState(ANALYTICS_CONSENT_DENIED);
}

export function grantAnalyticsConsent(
  trackingId: string,
  { trackCurrentPage = true }: { trackCurrentPage?: boolean } = {},
): void {
  persistAnalyticsConsent(ANALYTICS_CONSENT_GRANTED);
  setDocumentConsentState(ANALYTICS_CONSENT_GRANTED);
  bootstrapGoogleAnalytics(trackingId);

  // Cold loads with stored consent should rely on astro:page-load to avoid duplicates.
  if (trackCurrentPage) {
    trackPageView();
  }
}

function bindConsentUi(trackingId: string): void {
  const allowButton = document.getElementById(ANALYTICS_CONSENT_ALLOW_ID);
  if (allowButton instanceof globalThis.window.HTMLButtonElement) {
    allowButton.addEventListener('click', () => {
      grantAnalyticsConsent(trackingId, { trackCurrentPage: true });
    });
  }

  const declineButton = document.getElementById(ANALYTICS_CONSENT_DECLINE_ID);
  if (declineButton instanceof globalThis.window.HTMLButtonElement) {
    declineButton.addEventListener('click', () => {
      denyAnalyticsConsent();
    });
  }

  const resetButton = document.getElementById(ANALYTICS_CONSENT_RESET_ID);
  if (resetButton instanceof globalThis.window.HTMLButtonElement) {
    resetButton.addEventListener('click', () => {
      clearAnalyticsConsent();
      globalThis.window.location.reload();
    });
  }
}

export function initAnalyticsConsentManager(
  options: InitAnalyticsConsentManagerOptions = {},
): void {
  if (initialized || typeof document === 'undefined') return;

  const trackingId = options.trackingId ?? import.meta.env.PUBLIC_GA_TRACKING_ID;
  if (!trackingId) return;

  initialized = true;

  const storedConsent = readAnalyticsConsent();
  setDocumentConsentState(storedConsent ?? ANALYTICS_CONSENT_PENDING);
  bindConsentUi(trackingId);

  if (storedConsent === ANALYTICS_CONSENT_GRANTED) {
    bootstrapGoogleAnalytics(trackingId);
  }
}
