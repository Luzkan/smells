import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import type { Diagnosis } from '../../../src/lib/404/404-diagnoses';
import { initDiagnosis } from '../../../src/lib/404/404-diagnosis';
import { createLocalStorageMock, installGlobals } from '../fixtures';

const HOSTILE_DIAGNOSIS: Diagnosis = {
  smell: '<img src=x onerror=alert(1)>',
  slug: 'dead-code',
  text: 'Hostile-looking copy should stay inert.',
};

describe('404 diagnosis rendering', () => {
  let cleanupGlobals: (() => void) | undefined;

  function setup() {
    const { document, window } = parseHTML(`
      <html>
        <body>
          <span id="diagnosisQuote"></span>
          <div id="diagCounter"></div>
          <button id="shuffleBtn"></button>
        </body>
      </html>
    `);
    const localStorage = createLocalStorageMock();
    cleanupGlobals = installGlobals({ window, document, localStorage });

    const quote = document.getElementById('diagnosisQuote');
    const counter = document.getElementById('diagCounter');
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (!quote || !counter || !shuffleBtn) {
      throw new Error('404 diagnosis fixture is incomplete');
    }

    return { quote, counter, shuffleBtn };
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanupGlobals?.();
    cleanupGlobals = undefined;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders hostile-looking smell names as text after the crossfade delay', () => {
    const { quote, counter, shuffleBtn } = setup();

    initDiagnosis([HOSTILE_DIAGNOSIS], quote, counter, shuffleBtn);
    vi.advanceTimersByTime(300);

    const link = quote.querySelector<HTMLAnchorElement>('.smell-name');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/smells/dead-code');
    expect(link?.textContent).toBe(HOSTILE_DIAGNOSIS.smell);
    expect(quote.textContent).toContain(HOSTILE_DIAGNOSIS.smell);
    expect(quote.textContent).toContain(HOSTILE_DIAGNOSIS.text);
    expect(quote.querySelector('img')).toBeNull();
  });
});
