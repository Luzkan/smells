import { describe, expect, it } from 'vitest';
import { findOriginOrEarliestEntry, type HistoryEntry } from '../../../src/lib/content/smell-utils';

describe('origin helpers', () => {
  it('returns the first origin entry when present', () => {
    const mentionEntry: HistoryEntry = {
      author: 'Martin Fowler',
      type: 'mention',
      source: { year: 1999, authors: ['Martin Fowler'], name: 'Refactoring', type: 'book' },
    };
    const originEntry: HistoryEntry = {
      author: 'Kent Beck',
      type: 'origin',
      source: {
        year: 2000,
        authors: ['Kent Beck'],
        name: 'Smalltalk Best Practice Patterns',
        type: 'book',
      },
    };

    expect(findOriginOrEarliestEntry([mentionEntry, originEntry])).toBe(originEntry);
  });

  it('falls back to the first history entry when no origin type exists', () => {
    const mentionEntry: HistoryEntry = {
      author: 'Martin Fowler',
      type: 'mention',
      source: { year: 1999, authors: ['Martin Fowler'], name: 'Refactoring', type: 'book' },
    };
    const updateEntry: HistoryEntry = {
      author: 'Kent Beck',
      type: 'update',
      source: {
        year: 2000,
        authors: ['Kent Beck'],
        name: 'Smalltalk Best Practice Patterns',
        type: 'book',
      },
    };

    expect(findOriginOrEarliestEntry([mentionEntry, updateEntry])).toBe(mentionEntry);
  });

  it('returns null for empty history arrays', () => {
    expect(findOriginOrEarliestEntry([])).toBeNull();
  });
});
