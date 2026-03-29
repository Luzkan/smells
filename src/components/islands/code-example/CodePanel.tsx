/**
 * Single code panel. Shows a fade gradient on horizontal overflow
 * as a scroll affordance.
 */
import { useRef, useEffect, useCallback } from 'preact/hooks';
import type { CodeTab } from '../../../lib/types';

interface Props {
  readonly html: string;
  readonly variant: CodeTab;
  readonly slideDirection: 'left' | 'right' | null;
  readonly role?: 'tabpanel' | 'region';
}

export function CodePanel({ html, variant, slideDirection, role = 'tabpanel' }: Props) {
  const slideClass = slideDirection ? `code-panel--slide-${slideDirection}` : '';

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  const checkOverflow = useCallback(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;

    const pre = panel.querySelector('pre');
    if (!pre) return;

    const hasOverflow = pre.scrollWidth > pre.clientWidth;
    const atEnd = pre.scrollLeft + pre.clientWidth >= pre.scrollWidth - 2;

    wrap.classList.toggle('code-panel-wrap--has-overflow', hasOverflow);
    wrap.classList.toggle('code-panel-wrap--scrolled-end', hasOverflow && atEnd);

    if (hasOverflow && !revealedRef.current) {
      revealedRef.current = true;
      wrap.classList.add('code-panel-wrap--first-reveal');
    }
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const pre = panel.querySelector('pre');
    if (!pre) return;

    checkOverflow();

    pre.addEventListener('scroll', checkOverflow, { passive: true });

    const ro = new ResizeObserver(checkOverflow);
    ro.observe(pre);

    return () => {
      pre.removeEventListener('scroll', checkOverflow);
      ro.disconnect();
    };
  }, [html, checkOverflow]);

  return (
    <div class="code-panel-wrap" ref={wrapRef}>
      <div
        class={`code-panel code-panel--${variant} ${slideClass}`}
        role={role}
        aria-label={`${variant === 'smelly' ? 'Smelly' : 'Solution'} code`}
        ref={panelRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
