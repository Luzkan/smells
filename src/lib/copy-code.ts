/**
 * Shared clipboard utility for extracting clean text from rendered code HTML.
 *
 * Used by UtilityBar and PanelCopyButton to strip line numbers and labels
 * before copying to clipboard. Also exposes a generic copy-with-feedback
 * helper for module scripts.
 */

const COPY_FEEDBACK_MS = 1500;
const DEFAULT_FEEDBACK_CLASS = 'copied';

export async function copyToClipboardWithFeedback(
  text: string,
  el: Element,
  options: {
    feedbackClass?: string;
    durationMs?: number;
  } = {},
): Promise<boolean> {
  if (!navigator.clipboard) return false;

  const feedbackClass = options.feedbackClass ?? DEFAULT_FEEDBACK_CLASS;
  const durationMs = options.durationMs ?? COPY_FEEDBACK_MS;

  try {
    await navigator.clipboard.writeText(text);
    el.classList.add(feedbackClass);
    globalThis.setTimeout(() => {
      el.classList.remove(feedbackClass);
    }, durationMs);
    return true;
  } catch {
    return false;
  }
}

/** Shiki-rendered HTML → plain text, stripping line numbers and panel labels. */
export function extractCodeText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  temp.querySelectorAll('.line-number, .code-panel-label').forEach((el) => el.remove());
  return temp.textContent || '';
}

export { COPY_FEEDBACK_MS };
