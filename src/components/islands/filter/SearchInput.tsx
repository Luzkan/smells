import { useStore } from '@nanostores/preact';
import { useRef, useCallback, useState, useEffect } from 'preact/hooks';
import { $searchQuery, clearSearch, setSearchQuery } from '../../../stores/search';
import { cx } from '../../../lib/cx';
import { ICON_SEARCH } from '../../../lib/icon-paths';
import { detectPlatform, isSearchShortcut, type Platform } from '../../../lib/search-shortcut';
import { Icon } from '../Icon';

const SEARCH_INPUT_DEBOUNCE_MS = 200;

export function SearchInput() {
  const query = useStore($searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const platformRef = useRef<Platform>('other');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isLocalChange = useRef(false);
  const [focused, setFocused] = useState(false);

  const handleInput = useCallback((e: Event) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    const value = target.value;
    clearTimeout(debounceTimer.current);
    isLocalChange.current = true;
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
      isLocalChange.current = false;
    }, SEARCH_INPUT_DEBOUNCE_MS);
  }, []);

  // Sync input when store changes externally (clear-all, URL restore)
  useEffect(() => {
    if (!isLocalChange.current && inputRef.current && inputRef.current.value !== query) {
      inputRef.current.value = query;
    }
  }, [query]);

  const handleClear = useCallback(() => {
    clearTimeout(debounceTimer.current);
    isLocalChange.current = false;
    clearSearch();
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, []);

  // Global keyboard shortcut: / plus platform-native mod+K
  useEffect(() => {
    platformRef.current = detectPlatform();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchShortcut(e, platformRef.current)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasQuery = query.length > 0;

  return (
    <div class="filter-sidebar__search-wrap">
      <input
        ref={inputRef}
        type="text"
        class="filter-sidebar__search-input"
        placeholder="Search smells..."
        aria-label="Search code smells"
        defaultValue={query}
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Icon icon={ICON_SEARCH} size={14} class="filter-sidebar__search-icon" />
      <span
        class="filter-sidebar__search-kbd"
        style={{ opacity: focused || hasQuery ? 0 : 1 }}
        aria-hidden="true"
      >
        /
      </span>
      <button
        type="button"
        class={cx(
          'filter-sidebar__search-clear',
          hasQuery && 'filter-sidebar__search-clear--visible',
        )}
        onClick={handleClear}
        aria-label="Clear search"
      >
        &times;
      </button>
    </div>
  );
}
