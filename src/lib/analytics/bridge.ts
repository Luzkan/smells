import { ANALYTICS_EVENT_NAMES, trackEvent, trackPageView, type AnalyticsEvent } from './tracker';

type EventWithDetail = Event & { detail: unknown };

const KNOWN_EVENTS: ReadonlySet<string> = new Set(ANALYTICS_EVENT_NAMES);

let initialized = false;

function isKnownEventName(name: string): name is AnalyticsEvent['name'] {
  return KNOWN_EVENTS.has(name);
}

function hasDetail(event: Event): event is EventWithDetail {
  return 'detail' in event;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function reportInvalidEvent(message: string): void {
  if (import.meta.env.DEV) {
    throw new Error(message);
  }
  console.warn(message);
}

export function initAnalyticsBridge(): void {
  if (initialized) return;
  initialized = true;

  function analyticsHandler(event: Event): void {
    if (!hasDetail(event)) return;

    const detail = event.detail;
    if (!isRecord(detail) || typeof detail.name !== 'string') {
      reportInvalidEvent('[analytics-bridge] Invalid analytics event detail.');
      return;
    }

    if (!isKnownEventName(detail.name)) {
      reportInvalidEvent(`[analytics-bridge] Unknown analytics event: ${detail.name}`);
      return;
    }

    const params = detail.params;
    if (!isRecord(params)) {
      reportInvalidEvent(`[analytics-bridge] Invalid params for analytics event: ${detail.name}`);
      return;
    }

    // TS cannot correlate separate name + params into a discriminated union member.
    // The guards above have validated both, so this assertion is safe.
    trackEvent({
      name: detail.name,
      params,
    } as AnalyticsEvent);
  }

  document.addEventListener('analytics', analyticsHandler);
  document.addEventListener('astro:page-load', trackPageView);
}
