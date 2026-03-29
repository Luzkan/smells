import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parseHTML } from 'linkedom';
import { detectPlatform, isSearchShortcut } from '../../../src/lib/search-shortcut';
import { installGlobals } from '../fixtures';

function createKeyEvent(overrides: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return {
    key: '',
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    target: null,
    ...overrides,
  } as KeyboardEvent;
}

describe('search shortcut helpers', () => {
  let cleanupGlobals: (() => void) | undefined;
  let originalNavigatorDescriptor: PropertyDescriptor | undefined;

  function createTarget(html: string, selector: string) {
    const { document, window } = parseHTML(`<html><body>${html}</body></html>`);
    cleanupGlobals = installGlobals({ window, document });
    const target = document.querySelector(selector);
    if (!target) {
      throw new Error(`Missing target for selector ${selector}`);
    }
    return target;
  }

  beforeEach(() => {
    originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  });

  afterEach(() => {
    cleanupGlobals?.();
    cleanupGlobals = undefined;

    if (originalNavigatorDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor);
    } else {
      delete (globalThis as { navigator?: Navigator }).navigator;
    }
  });

  it('matches Cmd+K on mac platforms', () => {
    expect(isSearchShortcut(createKeyEvent({ key: 'K', metaKey: true }), 'mac')).toBe(true);
  });

  it('does not match Ctrl+K on mac platforms', () => {
    expect(isSearchShortcut(createKeyEvent({ key: 'k', ctrlKey: true }), 'mac')).toBe(false);
  });

  it('matches Ctrl+K on non-mac platforms', () => {
    expect(isSearchShortcut(createKeyEvent({ key: 'k', ctrlKey: true }), 'other')).toBe(true);
  });

  it('does not match Cmd+K on non-mac platforms', () => {
    expect(isSearchShortcut(createKeyEvent({ key: 'k', metaKey: true }), 'other')).toBe(false);
  });

  it('rejects extra modifiers for mod+K', () => {
    expect(
      isSearchShortcut(createKeyEvent({ key: 'k', metaKey: true, shiftKey: true }), 'mac'),
    ).toBe(false);
  });

  it('matches slash from non-input contexts', () => {
    const target = createTarget('<div id="target"></div>', '#target');
    expect(isSearchShortcut(createKeyEvent({ key: '/', target }), 'other')).toBe(true);
  });

  it('does not match slash inside inputs', () => {
    const target = createTarget('<input id="target" />', '#target');
    expect(isSearchShortcut(createKeyEvent({ key: '/', target }), 'other')).toBe(false);
  });

  it('does not match slash inside textareas', () => {
    const target = createTarget('<textarea id="target"></textarea>', '#target');
    expect(isSearchShortcut(createKeyEvent({ key: '/', target }), 'other')).toBe(false);
  });

  it('does not match slash inside contenteditable targets', () => {
    const target = createTarget('<div id="target" contenteditable="true"></div>', '#target');
    Object.defineProperty(target, 'isContentEditable', { value: true, configurable: true });
    expect(isSearchShortcut(createKeyEvent({ key: '/', target }), 'other')).toBe(false);
  });

  it('detects mac platforms from navigator.platform', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { platform: 'MacIntel' },
      configurable: true,
    });

    expect(detectPlatform()).toBe('mac');
  });

  it('detects non-mac platforms from navigator.platform', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { platform: 'Win32' },
      configurable: true,
    });

    expect(detectPlatform()).toBe('other');
  });
});
