/**
 * SegmentedToggle — Smelly/Solution tab switcher for CodeExample.
 *
 * Full-width segmented control with persistent red/green tints
 * for semantic color-blindness safety.
 */

import { cx } from '../../../lib/cx';
import type { CodeTab } from '../../../lib/types';

interface Props {
  activeTab: CodeTab;
  onSwitch: (tab: CodeTab) => void;
}

export function SegmentedToggle({ activeTab, onSwitch }: Props) {
  return (
    <div class="code-toggle" role="tablist" aria-label="Code example type">
      <button
        role="tab"
        aria-selected={activeTab === 'smelly'}
        class={cx(
          'code-segment',
          'code-segment--smelly',
          activeTab === 'smelly' && 'code-segment--active',
        )}
        onClick={() => onSwitch('smelly')}
      >
        <span class="code-segment__icon" aria-hidden="true">
          &#x2717;
        </span>
        Smelly
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'solution'}
        class={cx(
          'code-segment',
          'code-segment--solution',
          activeTab === 'solution' && 'code-segment--active',
        )}
        onClick={() => onSwitch('solution')}
      >
        <span class="code-segment__icon" aria-hidden="true">
          &#x2713;
        </span>
        Solution
      </button>
      <div
        class="code-toggle__indicator"
        style={{
          transform: activeTab === 'smelly' ? 'translateX(0)' : 'translateX(100%)',
        }}
      />
    </div>
  );
}
