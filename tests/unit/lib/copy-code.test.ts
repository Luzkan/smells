import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { extractCodeText } from '../../../src/lib/copy-code';
import { installGlobals } from '../fixtures';

describe('copy-code utilities', () => {
  let cleanup: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup?.();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('extractCodeText strips line numbers and panel labels', () => {
    const { document } = parseHTML('<html><body></body></html>');
    cleanup = installGlobals({ document });

    const html = `
      <pre>
        <span class="line-number">1</span>
        <span class="code-panel-label">Smelly</span>
        <span>const x = 1;</span>
      </pre>
    `;

    const text = extractCodeText(html);
    expect(text).toContain('const x = 1;');
    expect(text).not.toContain('Smelly');
  });
});
