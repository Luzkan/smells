import { useCallback, useState } from 'preact/hooks';
import { trackEvent } from '../../../lib/analytics/tracker';
import { COPY_FEEDBACK_MS, extractCodeText } from '../../../lib/copy-code';

import type { CodeTab } from '../../../lib/types';

type CopyPanelVariant = CodeTab | 'main';

export function useCopyToClipboard(codeHtml: string, slug: string, variant: CopyPanelVariant) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!navigator.clipboard) return;
    const text = extractCodeText(codeHtml);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);

        if (variant === 'main') {
          trackEvent({ name: 'code_copy', params: { smell: slug } });
        } else {
          trackEvent({ name: 'code_copy', params: { smell: slug, panel: variant } });
        }
      })
      .catch((err) => {
        console.error('[copy] clipboard write failed', err);
      });
  }, [codeHtml, slug, variant]);

  return { copied, copy };
}
