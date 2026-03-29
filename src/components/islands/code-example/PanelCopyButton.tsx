import { useCopyToClipboard } from './useCopyToClipboard';
import { cx } from '../../../lib/cx';
import { ICON_COPY, ICON_CHECK } from '../../../lib/icon-paths';
import { Icon } from '../Icon';
import type { CodeTab } from '../../../lib/types';

interface Props {
  readonly codeHtml: string;
  readonly slug: string;
  readonly variant: CodeTab;
}

export function PanelCopyButton({ codeHtml, slug, variant }: Props) {
  const { copied, copy } = useCopyToClipboard(codeHtml, slug, variant);

  return (
    <button
      class={cx('code-example__panel-copy', copied && 'code-example__panel-copy--copied')}
      onClick={copy}
      type="button"
      aria-label={copied ? 'Copied!' : `Copy ${variant} code`}
      title={copied ? 'Copied!' : 'Copy'}
    >
      <Icon icon={copied ? ICON_CHECK : ICON_COPY} size={14} strokeWidth={2} />
    </button>
  );
}
