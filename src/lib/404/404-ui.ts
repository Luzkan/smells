/**
 * 404 page UI wiring — go-back button, share button, fuzzy suggestion.
 * All functions return cleanup callbacks for View Transition compatibility.
 */

import { findBestMatch, type FuzzyCandidate } from './fuzzy-match';
import type { Diagnosis } from './404-diagnoses';

const SVG_NS = 'http://www.w3.org/2000/svg';

function goBack(): void {
  if (globalThis.history.length > 1) {
    globalThis.history.back();
  } else {
    globalThis.location.href = '/';
  }
}

function createSuggestionArrow(doc: Document): SVGSVGElement {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');

  const line = doc.createElementNS(SVG_NS, 'path');
  line.setAttribute('d', 'M5 12h14');

  const head = doc.createElementNS(SVG_NS, 'path');
  head.setAttribute('d', 'M12 5l7 7-7 7');

  svg.append(line, head);
  return svg;
}

function createSuggestionLink(doc: Document, candidate: FuzzyCandidate): HTMLAnchorElement {
  const anchor = doc.createElement('a');
  anchor.setAttribute('href', `/smells/${candidate.slug}`);

  const label = doc.createElement('span');
  label.className = 'suggestion-label';
  label.textContent = 'Did you mean';

  const spacer = doc.createTextNode(' ');

  const name = doc.createElement('span');
  name.className = 'suggestion-name';
  name.textContent = candidate.name;

  anchor.append(label, spacer, name, createSuggestionArrow(doc));
  return anchor;
}

export function initGoBack(btn: HTMLElement | null): () => void {
  if (!btn) return () => {};
  btn.addEventListener('click', goBack);
  return () => btn.removeEventListener('click', goBack);
}

export function initShareButton(
  btn: HTMLElement | null,
  getCurrentDiagnosis: () => Diagnosis,
  siteUrl: string,
  copyFeedbackMs: number,
): () => void {
  if (!btn) return () => {};
  const el = btn;

  function handleClick(): void {
    const d = getCurrentDiagnosis();
    const shareUrl = `${siteUrl}/smells/${d.slug}?ref=404`;
    const text = `${d.smell} \u2014 ${d.text} \u2014 ${siteUrl.replaceAll(/^https?:\/\//g, '')}`;
    const clipboardText = `${d.smell} \u2014 ${d.text} \u2014 ${shareUrl}`;
    if (navigator.share) {
      navigator.share({ text, url: shareUrl }).catch(() => {});
    } else if (navigator.clipboard) {
      void navigator.clipboard
        .writeText(clipboardText)
        .then(() => {
          el.classList.add('copied');
          setTimeout(() => el.classList.remove('copied'), copyFeedbackMs);
        })
        .catch(() => {});
    }
  }

  el.addEventListener('click', handleClick);
  return () => el.removeEventListener('click', handleClick);
}

export function initFuzzySuggestion(
  candidates: FuzzyCandidate[],
  suggestionEl: HTMLElement | null,
): void {
  const path = globalThis.location.pathname.replaceAll(/^\/|\/$/g, '').toLowerCase();
  if (!path || path === '404' || path === '404.html') {
    suggestionEl?.replaceChildren();
    if (suggestionEl) suggestionEl.style.display = 'none';
    return;
  }

  const match = findBestMatch(path, candidates);

  if (suggestionEl) {
    if (match) {
      suggestionEl.replaceChildren(
        createSuggestionLink(suggestionEl.ownerDocument, match.candidate),
      );
      suggestionEl.style.display = '';
    } else {
      suggestionEl.replaceChildren();
      suggestionEl.style.display = 'none';
    }
  }

  dispatchNotFoundAnalytics(match?.candidate.slug);
}

function dispatchNotFoundAnalytics(suggestedSlug?: string): void {
  document.dispatchEvent(
    new CustomEvent('analytics', {
      detail: {
        name: 'not_found',
        params: {
          path: globalThis.location.pathname,
          suggested: suggestedSlug,
        },
      },
    }),
  );
}
