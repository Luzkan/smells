/**
 * Diagnosis rotation logic for the 404 page.
 * Manages cycling through diagnoses with localStorage tracking of seen items.
 */

import type { Diagnosis } from './404-diagnoses';

const SEEN_KEY = '404-diagnoses-seen';
const DIAGNOSIS_CROSSFADE_MS = 300;

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item): item is number => typeof item === 'number');
}

function getSeenDiagnoses(): Set<number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    return isNumberArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function markDiagnosisSeen(
  idx: number,
  diagnoses: Diagnosis[],
  counterEl: HTMLElement | null,
): void {
  const seen = getSeenDiagnoses();
  seen.add(idx);
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
  } catch {
    /* quota/security */
  }
  updateCounter(diagnoses, counterEl, seen);
}

function updateCounter(
  diagnoses: Diagnosis[],
  el: HTMLElement | null,
  seen = getSeenDiagnoses(),
): void {
  if (!el) return;
  if (seen.size >= diagnoses.length) {
    el.innerHTML = `<span class="counter-current">${diagnoses.length}</span> of ${diagnoses.length} discovered \u2014 you\u2019ve caught them all`;
  } else {
    el.innerHTML = `<span class="counter-current">${seen.size}</span> of ${diagnoses.length} diagnoses discovered`;
  }
}

function createDiagnosisLink(doc: Document, diagnosis: Diagnosis): HTMLAnchorElement {
  const anchor = doc.createElement('a');
  anchor.className = 'smell-name';
  anchor.setAttribute('href', `/smells/${diagnosis.slug}`);
  anchor.textContent = diagnosis.smell;
  return anchor;
}

interface DiagnosisController {
  currentDiagnosis(): Diagnosis;
  render(): void;
  next(): void;
  cleanup(): void;
}

export function initDiagnosis(
  diagnoses: Diagnosis[],
  quoteEl: HTMLElement | null,
  counterEl: HTMLElement | null,
  shuffleBtn: HTMLElement | null,
): DiagnosisController {
  let diagIdx = Math.floor(Math.random() * diagnoses.length);

  function render(): void {
    const d = diagnoses[diagIdx];
    if (!quoteEl) return;
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(4px)';
    setTimeout(() => {
      quoteEl.replaceChildren(
        quoteEl.ownerDocument.createTextNode('Or maybe it\u2019s '),
        createDiagnosisLink(quoteEl.ownerDocument, d),
        quoteEl.ownerDocument.createTextNode('\u2009\u2014\u2009'),
        quoteEl.ownerDocument.createTextNode(d.text),
      );
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, DIAGNOSIS_CROSSFADE_MS);
    markDiagnosisSeen(diagIdx, diagnoses, counterEl);
  }

  function next(): void {
    diagIdx = (diagIdx + 1) % diagnoses.length;
    render();
  }

  function handleShuffle(): void {
    next();
    shuffleBtn?.classList.add('spinning');
    shuffleBtn?.addEventListener(
      'animationend',
      () => {
        shuffleBtn?.classList.remove('spinning');
      },
      { once: true },
    );
  }

  shuffleBtn?.addEventListener('click', handleShuffle);

  function cleanup(): void {
    shuffleBtn?.removeEventListener('click', handleShuffle);
  }

  render();

  return { currentDiagnosis: () => diagnoses[diagIdx], render, next, cleanup };
}
