import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import type { Diagnosis } from '../../../src/lib/404/404-diagnoses';
import { initFuzzySuggestion, initShareButton } from '../../../src/lib/404/404-ui';
import { installGlobals } from '../fixtures';

const DIAGNOSIS: Diagnosis = {
  smell: 'Dead Code',
  slug: 'dead-code',
  text: 'Unreachable content that confuses visitors about what exists.',
};
const HOSTILE_SMELL_NAME = '<img src=x onerror=alert(1)>';

type ShareNavigator = Partial<Pick<Navigator, 'share' | 'clipboard'>>;
type ClipboardLike = NonNullable<Navigator['clipboard']>;

describe('404 ui share button', () => {
  let cleanupGlobals: (() => void) | undefined;
  let cleanupShareButton: (() => void) | undefined;
  let originalNavigatorDescriptor: PropertyDescriptor | undefined;

  function setup(navigatorValue: ShareNavigator) {
    const { document, window } = parseHTML(
      '<html><body><button id="shareBtn"></button></body></html>',
    );
    cleanupGlobals = installGlobals({ window, document });
    Object.defineProperty(globalThis, 'navigator', {
      value: navigatorValue,
      configurable: true,
    });

    const button = document.getElementById('shareBtn');
    if (!button) {
      throw new Error('share button not found');
    }

    cleanupShareButton = initShareButton(button, () => DIAGNOSIS, 'https://codesmells.org', 250);

    return { button, window };
  }

  beforeEach(() => {
    vi.useFakeTimers();
    originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  });

  afterEach(() => {
    cleanupShareButton?.();
    cleanupShareButton = undefined;
    cleanupGlobals?.();
    cleanupGlobals = undefined;

    if (originalNavigatorDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor);
    } else {
      delete (globalThis as { navigator?: Navigator }).navigator;
    }

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shares the canonical smell URL when Web Share is available', () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const { button, window } = setup({ share });

    button.dispatchEvent(new window.Event('click', { bubbles: true }));

    expect(share).toHaveBeenCalledWith({
      text: 'Dead Code \u2014 Unreachable content that confuses visitors about what exists. \u2014 codesmells.org',
      url: 'https://codesmells.org/smells/dead-code?ref=404',
    });
  });

  it('copies the canonical smell URL when Web Share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const { button, window } = setup({
      clipboard: { writeText } as unknown as ClipboardLike,
    });

    button.dispatchEvent(new window.Event('click', { bubbles: true }));
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith(
      'Dead Code \u2014 Unreachable content that confuses visitors about what exists. \u2014 https://codesmells.org/smells/dead-code?ref=404',
    );
    expect(button.classList.contains('copied')).toBe(true);

    vi.advanceTimersByTime(250);
    expect(button.classList.contains('copied')).toBe(false);
  });
});

describe('404 ui fuzzy suggestion', () => {
  let cleanupGlobals: (() => void) | undefined;
  let originalLocationDescriptor: PropertyDescriptor | undefined;
  let originalCustomEventDescriptor: PropertyDescriptor | undefined;

  function setup(pathname: string) {
    const { document, window } = parseHTML(
      '<html><body><div id="suggestion404" style="display: none;"></div></body></html>',
    );
    cleanupGlobals = installGlobals({ window, document });

    Object.defineProperty(globalThis, 'location', {
      value: { pathname },
      configurable: true,
    });
    Object.defineProperty(globalThis, 'CustomEvent', {
      value: window.CustomEvent,
      configurable: true,
    });

    const suggestion = document.getElementById('suggestion404');
    if (!suggestion) {
      throw new Error('suggestion container not found');
    }

    return { document, suggestion };
  }

  beforeEach(() => {
    originalLocationDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'location');
    originalCustomEventDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'CustomEvent');
  });

  afterEach(() => {
    cleanupGlobals?.();
    cleanupGlobals = undefined;

    if (originalLocationDescriptor) {
      Object.defineProperty(globalThis, 'location', originalLocationDescriptor);
    } else {
      delete (globalThis as { location?: Location }).location;
    }

    if (originalCustomEventDescriptor) {
      Object.defineProperty(globalThis, 'CustomEvent', originalCustomEventDescriptor);
    } else {
      delete (globalThis as { CustomEvent?: typeof CustomEvent }).CustomEvent;
    }

    vi.restoreAllMocks();
  });

  it('renders hostile-looking candidate names as text', () => {
    const { suggestion } = setup('/dead-cod');

    initFuzzySuggestion(
      [
        {
          slug: 'dead-code',
          name: HOSTILE_SMELL_NAME,
        },
      ],
      suggestion,
    );

    const link = suggestion.querySelector<HTMLAnchorElement>('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/smells/dead-code');
    expect(suggestion.querySelector('.suggestion-label')?.textContent).toBe('Did you mean');
    expect(suggestion.querySelector('.suggestion-name')?.textContent).toBe(HOSTILE_SMELL_NAME);
    expect(link?.textContent).toContain(HOSTILE_SMELL_NAME);
    expect(suggestion.querySelectorAll('svg path')).toHaveLength(2);
    expect(suggestion.querySelector('img')).toBeNull();
    expect(suggestion.style.display).toBe('');
  });
});
