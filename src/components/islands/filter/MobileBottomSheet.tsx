import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { cx } from '../../../lib/cx';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface MobileBottomSheetProps {
  readonly activeCount: number;
  readonly children: ComponentChildren;
  readonly showApplyButton?: boolean;
}

export function MobileBottomSheet({
  activeCount,
  children,
  showApplyButton = true,
}: MobileBottomSheetProps) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeLabelSuffix = activeCount > 0 ? ` (${activeCount} active)` : '';

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    sheet.toggleAttribute('inert', !open);
  }, [open]);

  // Body scroll lock + focus management
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';

    // Focus the close button (first focusable element in sheet)
    const sheet = sheetRef.current;
    if (sheet) {
      const firstFocusable = sheet.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [open]);

  // Focus trap + Escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;

      const focusable = sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Pill trigger button */}
      <button
        ref={triggerRef}
        type="button"
        class="filter-sidebar__mobile-fab"
        onClick={handleOpen}
        aria-label={`Open filters${activeLabelSuffix}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        Filters
        {activeCount > 0 && <span class="filter-sidebar__mobile-fab-badge">{activeCount}</span>}
      </button>

      {/* Overlay backdrop */}
      <button
        type="button"
        class={cx('filter-sidebar__sheet-overlay', open && 'filter-sidebar__sheet-overlay--open')}
        onClick={handleClose}
        aria-label="Close filters"
        aria-hidden={open ? 'false' : 'true'}
        disabled={!open}
        tabIndex={open ? 0 : -1}
      />

      {/* Bottom sheet panel */}
      <div
        ref={sheetRef}
        class={cx('filter-sidebar__sheet', open && 'filter-sidebar__sheet--open')}
        role="dialog"
        aria-hidden={open ? 'false' : 'true'}
        aria-modal={open ? 'true' : 'false'}
        aria-label="Filter smells"
        inert={!open}
      >
        <div class="filter-sidebar__sheet-handle" />
        {/* Header row */}
        <div class="filter-sidebar__sheet-header">
          <span class="filter-sidebar__sheet-title">Filter Smells</span>
          <button
            type="button"
            class="filter-sidebar__sheet-close"
            onClick={handleClose}
            aria-label="Close filters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
        {showApplyButton && (
          <div class="filter-sidebar__sheet-apply-wrap">
            <button type="button" class="filter-sidebar__sheet-apply" onClick={handleClose}>
              Apply
            </button>
          </div>
        )}
      </div>
    </>
  );
}
