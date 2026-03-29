/**
 * Preact island for interactive Smelly/Solution code comparison (client:visible).
 *
 * Compare mode stacks panels vertically — works because examples are short
 * (3-8 lines); revisit if examples grow. Props receive pre-rendered Shiki HTML.
 */
import { useState, useCallback, useRef, useEffect } from 'preact/hooks';
import { Component } from 'preact';
import type { ComponentChildren } from 'preact';
import { SegmentedToggle } from './code-example/SegmentedToggle';
import { CodePanel } from './code-example/CodePanel';
import { UtilityBar } from './code-example/UtilityBar';
import { CompareTransformDivider } from './code-example/CompareTransformDivider';
import { PanelCopyButton } from './code-example/PanelCopyButton';
import { trackEvent } from '../../lib/analytics/tracker';
import type { CodePanelData, CodeTab } from '../../lib/types';
import { cx } from '../../lib/cx';
import './CodeExample.css';

const COMPARE_TRANSITION_FALLBACK_MS = 400;
const CAPTION_CROSSFADE_MS = 180;
const SLIDE_ANIMATION_MS = 300;

/**
 * Manages the grid-based reveal/collapse animation for the solution panel
 * when entering/exiting compare mode.
 */
function useCompareTransition(
  compareMode: boolean,
  wrapperRef: { current: HTMLDivElement | null },
  isAnimatingRef: { current: boolean },
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      isAnimatingRef.current = false;
      return;
    }
    if (!compareMode) {
      isAnimatingRef.current = false;
      return;
    }

    requestAnimationFrame(() => {
      wrapper.classList.add('is-visible');
    });

    const reducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      isAnimatingRef.current = false;
      return;
    }

    const handleEnd = () => {
      isAnimatingRef.current = false;
    };
    wrapper.addEventListener('transitionend', handleEnd, { once: true });
    const fallback = setTimeout(() => {
      isAnimatingRef.current = false;
    }, COMPARE_TRANSITION_FALLBACK_MS);
    return () => {
      clearTimeout(fallback);
    };
  }, [compareMode]);
}

class InternalErrorBoundary extends Component<
  { fallbackHtml: string; children: ComponentChildren },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[CodeExample]', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          class="code-example code-example--fallback"
          dangerouslySetInnerHTML={{ __html: this.props.fallbackHtml }}
        />
      );
    }
    return this.props.children;
  }
}

interface SharedProps {
  readonly slug: string;
  readonly smelly: CodePanelData;
  readonly fallbackHtml: string;
}

interface SmellyOnlyCodeExampleProps extends SharedProps {
  readonly kind: 'smelly-only';
}

interface DualCodeExampleProps extends SharedProps {
  readonly kind: 'with-solution';
  readonly solution: CodePanelData;
}

type Props = SmellyOnlyCodeExampleProps | DualCodeExampleProps;

function SmellyOnlyCodeExample({ fallbackHtml, smelly, slug }: SharedProps) {
  return (
    <InternalErrorBoundary fallbackHtml={fallbackHtml}>
      <div class="code-example code-example--smelly-only">
        {smelly.caption && <div class="code-example__caption">{smelly.caption}</div>}
        <div class="code-example__header code-example__header--smelly-only">
          <span class="code-example__smelly-label">
            <span class="code-segment__icon" aria-hidden="true">
              &#x2717;
            </span>{' '}
            Smelly
          </span>
        </div>
        <div class="code-example__panels code-example__panels--smelly">
          <CodePanel html={smelly.html} variant="smelly" slideDirection={null} />
        </div>
        <UtilityBar language={smelly.lang} codeHtml={smelly.html} slug={slug} />
      </div>
    </InternalErrorBoundary>
  );
}

function DualCodeExample({ slug, smelly, solution, fallbackHtml }: DualCodeExampleProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('smelly');
  const [compareMode, setCompareMode] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const prevTabRef = useRef<CodeTab>('smelly');
  const isAnimatingRef = useRef(false);
  const solutionWrapperRef = useRef<HTMLDivElement>(null);
  const compareBtnRef = useRef<HTMLButtonElement>(null);

  const captions = {
    smelly: smelly.caption || solution.caption,
    solution: solution.caption || smelly.caption,
  };
  const [displayedCaption, setDisplayedCaption] = useState(captions.smelly);
  const [captionFading, setCaptionFading] = useState(false);
  const hasCaption = !!(smelly.caption || solution.caption);
  const hasDualCaptions = !!(
    solution.caption &&
    smelly.caption &&
    smelly.caption !== solution.caption
  );

  // Aria-live status message for screen readers

  const [liveMessage, setLiveMessage] = useState('');

  const crossfadeCaption = useCallback(
    (tab: CodeTab) => {
      setCaptionFading(true);
      setTimeout(() => {
        setDisplayedCaption(captions[tab]);
        setCaptionFading(false);
      }, CAPTION_CROSSFADE_MS);
    },
    [captions.smelly, captions.solution],
  );

  const handleSwitch = useCallback(
    (tab: CodeTab) => {
      if (tab === activeTab) return;

      trackEvent({ name: 'code_toggle', params: { smell: slug, tab } });

      setSlideDirection(tab === 'solution' ? 'right' : 'left');
      prevTabRef.current = activeTab;
      setActiveTab(tab);

      if (hasDualCaptions) crossfadeCaption(tab);

      setTimeout(() => setSlideDirection(null), SLIDE_ANIMATION_MS);
    },
    [activeTab, hasDualCaptions, crossfadeCaption],
  );

  const handleCompareToggle = useCallback(() => {
    if (isAnimatingRef.current) return;
    const entering = !compareMode;
    setCompareMode(entering);
    isAnimatingRef.current = true;
    setLiveMessage(entering ? 'Showing both examples' : 'Returned to single view');
    trackEvent({
      name: 'code_compare',
      params: { smell: slug, action: entering ? 'enter' : 'exit' },
    });
  }, [compareMode, slug]);

  useCompareTransition(compareMode, solutionWrapperRef, isAnimatingRef);

  useEffect(() => {
    compareBtnRef.current?.focus({ preventScroll: true });
  }, [compareMode]);

  const isSmellyActive = activeTab === 'smelly';
  const currentHtml = isSmellyActive ? smelly.html : solution.html;
  const currentLang = isSmellyActive ? smelly.lang : solution.lang;
  const compareLang =
    smelly.lang === solution.lang ? smelly.lang : `${smelly.lang} / ${solution.lang}`;

  const compareButton = (
    <button
      ref={compareBtnRef}
      class={cx('code-example__compare-btn', compareMode && 'code-example__compare-btn--active')}
      onClick={handleCompareToggle}
      type="button"
      aria-label={compareMode ? 'Exit compare mode' : 'Show both examples'}
      title={compareMode ? 'Exit compare mode' : 'Show both examples'}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="7" rx="2" ry="2" />
        <rect x="3" y="14" width="18" height="7" rx="2" ry="2" />
      </svg>
      {compareMode ? 'Exit' : 'Compare'}
    </button>
  );

  return (
    <InternalErrorBoundary fallbackHtml={fallbackHtml}>
      <div class={cx('code-example', compareMode && 'code-example--compare')}>
        {/* Aria-live region for screen readers */}
        <div class="sr-only" aria-live="polite" role="status">
          {liveMessage}
        </div>

        {/* Caption — hidden in compare mode */}
        {hasCaption && !compareMode && (
          <div
            class={cx('code-example__caption', captionFading && 'code-example__caption--fading')}
          >
            {displayedCaption}
          </div>
        )}

        {compareMode ? (
          /* ---- Compare mode: stacked panels ---- */
          <section class="code-example__compare-panels" aria-label="Code comparison">
            {/* Smelly panel bar + panel */}
            <div class="code-example__compare-section code-example__panels--smelly">
              <div class="code-example__panel-bar code-example__panel-bar--smelly">
                <span class="code-example__panel-bar-label">
                  <span class="code-segment__icon" aria-hidden="true">
                    &#x2717;
                  </span>{' '}
                  Smelly
                </span>
                <div class="code-example__panel-bar-actions">
                  <PanelCopyButton codeHtml={smelly.html} slug={slug} variant="smelly" />
                  {compareButton}
                </div>
              </div>
              <CodePanel html={smelly.html} variant="smelly" slideDirection={null} role="region" />
            </div>

            <CompareTransformDivider />

            {/* Solution panel — wrapped for grid-based reveal animation */}
            <div ref={solutionWrapperRef} class="code-example__solution-wrapper">
              <div class="code-example__solution-wrapper-inner">
                <div class="code-example__compare-section code-example__panels--solution">
                  <div class="code-example__panel-bar code-example__panel-bar--solution">
                    <span class="code-example__panel-bar-label">
                      <span class="code-segment__icon" aria-hidden="true">
                        &#x2713;
                      </span>{' '}
                      Solution
                    </span>
                    <div class="code-example__panel-bar-actions">
                      <PanelCopyButton codeHtml={solution.html} slug={slug} variant="solution" />
                    </div>
                  </div>
                  <CodePanel
                    html={solution.html}
                    variant="solution"
                    slideDirection={null}
                    role="region"
                  />
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* ---- Default mode: tabbed panels ---- */
          <>
            <div class="code-example__header">
              <SegmentedToggle activeTab={activeTab} onSwitch={handleSwitch} />
              {compareButton}
            </div>
            <div class={`code-example__panels code-example__panels--${activeTab}`}>
              <CodePanel html={currentHtml} variant={activeTab} slideDirection={slideDirection} />
            </div>
          </>
        )}

        {compareMode ? (
          <div class="code-utility-bar">
            {compareLang && <span class="code-utility-bar__lang">{compareLang.toUpperCase()}</span>}
          </div>
        ) : (
          <UtilityBar language={currentLang} codeHtml={currentHtml} slug={slug} />
        )}
      </div>
    </InternalErrorBoundary>
  );
}

export default function CodeExample(props: Props) {
  if (props.kind === 'smelly-only') {
    return (
      <SmellyOnlyCodeExample
        slug={props.slug}
        smelly={props.smelly}
        fallbackHtml={props.fallbackHtml}
      />
    );
  }

  return <DualCodeExample {...props} />;
}
