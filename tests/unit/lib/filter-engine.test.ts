import { describe, it, expect } from 'vitest';
import { matchesFilters, matchesSearch } from '../../../src/lib/catalog/filter-engine';
import { createEmptyFilters } from '../../../src/lib/catalog/dimensions';
import { makeSmell } from '../fixtures';

describe('matchesFilters', () => {
  it('returns true when all dimensions are empty (no constraint)', () => {
    const smell = makeSmell();
    expect(matchesFilters(smell, createEmptyFilters())).toBe(true);
  });

  it('matches single dimension with one active value', () => {
    const smell = makeSmell({
      categories: {
        expanse: 'Within',
        obstruction: ['Bloaters'],
        occurrence: ['Measured Smells'],
        smell_hierarchies: ['Code Smell'],
        tags: [],
      },
    });
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters']);
    expect(matchesFilters(smell, filters)).toBe(true);
  });

  it('does not match single dimension with wrong value', () => {
    const smell = makeSmell();
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Couplers']);
    expect(matchesFilters(smell, filters)).toBe(false);
  });

  it('OR within dimension: matches if any value in the dimension matches', () => {
    const smell = makeSmell();
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters', 'Couplers']);
    expect(matchesFilters(smell, filters)).toBe(true);
  });

  it('AND across dimensions: must match all active dimensions', () => {
    const smell = makeSmell();
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters']);
    filters.expanse = new Set(['Between']); // smell is "Within"
    expect(matchesFilters(smell, filters)).toBe(false);
  });

  it('AND across dimensions: matches when all dimensions pass', () => {
    const smell = makeSmell();
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters']);
    filters.expanse = new Set(['Within']);
    expect(matchesFilters(smell, filters)).toBe(true);
  });

  it('handles smell with multiple values in a dimension', () => {
    const smell = makeSmell({
      categories: {
        expanse: 'Within',
        obstruction: ['Bloaters', 'Couplers'],
        occurrence: ['Measured Smells'],
        smell_hierarchies: ['Code Smell'],
        tags: [],
      },
    });
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Couplers']);
    expect(matchesFilters(smell, filters)).toBe(true);
  });
});

describe('matchesSearch', () => {
  it('returns true for empty query', () => {
    const smell = makeSmell();
    expect(matchesSearch(smell, '')).toBe(true);
    expect(matchesSearch(smell, '   ')).toBe(true);
  });

  it('matches title case-insensitively', () => {
    const smell = makeSmell({
      meta: { last_update_date: new Date(), title: 'Magic Number', known_as: [] },
    });
    expect(matchesSearch(smell, 'magic')).toBe(true);
    expect(matchesSearch(smell, 'MAGIC')).toBe(true);
    expect(matchesSearch(smell, 'number')).toBe(true);
  });

  it('matches known_as', () => {
    const smell = makeSmell({
      meta: {
        last_update_date: new Date(),
        title: 'Magic Number',
        known_as: ['Uncommunicative Number'],
      },
    });
    expect(matchesSearch(smell, 'uncommunicative')).toBe(true);
  });

  it('does not match unrelated query', () => {
    const smell = makeSmell();
    expect(matchesSearch(smell, 'zzzzzzz')).toBe(false);
  });
});
