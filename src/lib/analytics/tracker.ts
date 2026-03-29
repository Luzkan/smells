/** Typed GA4 event tracking. All events flow through trackEvent(). */
import type { DimensionKey } from '../catalog/dimensions';
import type { CodeTab } from '../types';

// -- Event taxonomy --------------------------------------------------------

export type AnalyticsEvent =
  | { name: 'article_feedback'; params: { smell: string; vote: 'up' | 'down' } }
  | { name: 'share'; params: { method: 'copy' | 'twitter' | 'linkedin'; smell: string } }
  | { name: 'cite_copy'; params: { format: 'bibtex' | 'apa' | 'markdown'; smell: string } }
  | { name: 'code_toggle'; params: { smell: string; tab: CodeTab } }
  | { name: 'code_compare'; params: { smell: string; action: 'enter' | 'exit' } }
  | { name: 'code_copy'; params: { smell: string; panel?: CodeTab } }
  | {
      name: 'filter_toggle';
      params: { dimension: DimensionKey; value: string; action: 'add' | 'remove' };
    }
  | { name: 'filter_reset'; params: Record<string, never> }
  | { name: 'filter_restore'; params: { dimensions: string; query: string } }
  | { name: 'catalog_search'; params: { query: string; result_count: number } }
  | { name: 'sort_change'; params: { sort: 'alpha' | 'category' } }
  | { name: 'view_change'; params: { view: 'grid' | 'list' } }
  | { name: 'theme_toggle'; params: { theme: 'light' | 'dark' } }
  | { name: 'navigate_random'; params: { from_smell: string; to_smell: string } }
  | { name: 'copy_link'; params: { smell: string } }
  | { name: 'not_found'; params: { path: string; suggested?: string } };

export const ANALYTICS_EVENT_NAMES = [
  'article_feedback',
  'share',
  'cite_copy',
  'code_toggle',
  'code_compare',
  'code_copy',
  'filter_toggle',
  'filter_reset',
  'filter_restore',
  'catalog_search',
  'sort_change',
  'view_change',
  'theme_toggle',
  'navigate_random',
  'copy_link',
  'not_found',
] as const satisfies readonly AnalyticsEvent['name'][];

// -- Debug ----------------------------------------------------------------

function isDebug(): boolean {
  return (
    typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug_analytics')
  );
}

// -- Core ------------------------------------------------------------------

export function trackEvent(event: AnalyticsEvent): void {
  const { name, params } = event;

  if (isDebug()) {
    console.table({ event: name, ...params });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function trackPageView(): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  if (isDebug()) {
    console.table({
      event: 'page_view',
      page_location: window.location.href,
      page_title: document.title,
    });
  }
}

// -- Helpers ---------------------------------------------------------------

const MAX_ANALYTICS_QUERY_LENGTH = 40;

export function normalizeQuery(raw: string): string {
  return raw.toLowerCase().trim().slice(0, MAX_ANALYTICS_QUERY_LENGTH);
}
