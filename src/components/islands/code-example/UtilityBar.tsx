import { useCopyToClipboard } from './useCopyToClipboard';
import { cx } from '../../../lib/cx';
import { ICON_COPY, ICON_CHECK } from '../../../lib/icon-paths';
import { Icon } from '../Icon';

interface Props {
  readonly language: string;
  readonly codeHtml: string;
  readonly slug: string;
}

export function UtilityBar({ language, codeHtml, slug }: Props) {
  const { copied, copy } = useCopyToClipboard(codeHtml, slug, 'main');

  return (
    <div class="code-utility-bar">
      {language && <span class="code-utility-bar__lang">{language.toUpperCase()}</span>}
      <button
        class={cx('code-utility-bar__copy', copied && 'code-utility-bar__copy--copied')}
        onClick={copy}
        type="button"
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <>
            <Icon icon={ICON_CHECK} size={14} strokeWidth={2} />
            Copied!
          </>
        ) : (
          <>
            <Icon icon={ICON_COPY} size={14} strokeWidth={2} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
