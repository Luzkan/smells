import { describe, it, expect } from 'vitest';
import { serializeFilters, deserializeFilters } from '../../../src/lib/catalog/url-state';
import { DIMENSION_CONFIG, createEmptyFilters } from '../../../src/lib/catalog/dimensions';

describe('serializeFilters', () => {
  it('returns empty string for no active filters and no query', () => {
    expect(serializeFilters(createEmptyFilters(), '')).toBe('');
  });

  it('serializes a single dimension filter', () => {
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters']);
    const hash = serializeFilters(filters, '');
    expect(hash).toBe('#obstruction=Bloaters');
  });

  it('serializes multiple values in one dimension', () => {
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters', 'Couplers']);
    const hash = serializeFilters(filters, '');
    // Values sorted alphabetically
    expect(hash).toContain('obstruction=Bloaters');
    expect(hash).toContain('obstruction=Couplers');
  });

  it('maps smell_hierarchies to hierarchy in URL', () => {
    const filters = createEmptyFilters();
    filters.smell_hierarchies = new Set(['Code Smell']);
    const hash = serializeFilters(filters, '');
    expect(hash).toContain('hierarchy=');
    expect(hash).not.toContain('smell_hierarchies=');
  });

  it('includes search query as q parameter', () => {
    const hash = serializeFilters(createEmptyFilters(), 'magic');
    expect(hash).toBe('#q=magic');
  });

  it('combines filters and query', () => {
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Bloaters']);
    const hash = serializeFilters(filters, 'test');
    expect(hash).toContain('obstruction=Bloaters');
    expect(hash).toContain('q=test');
  });
});

describe('deserializeFilters', () => {
  it('returns empty state for empty hash', () => {
    const { filters, query } = deserializeFilters('');
    expect(query).toBe('');
    for (const dim of DIMENSION_CONFIG) {
      expect(filters[dim.key].size).toBe(0);
    }
  });

  it('returns empty state for hash with only #', () => {
    const { filters, query } = deserializeFilters('#');
    expect(query).toBe('');
    for (const dim of DIMENSION_CONFIG) {
      expect(filters[dim.key].size).toBe(0);
    }
  });

  it('parses a single filter', () => {
    const { filters } = deserializeFilters('#obstruction=Bloaters');
    expect(filters.obstruction.has('Bloaters')).toBe(true);
  });

  it('parses hierarchy URL param back to smell_hierarchies key', () => {
    const { filters } = deserializeFilters('#hierarchy=Code+Smell');
    expect(filters.smell_hierarchies.has('Code Smell')).toBe(true);
  });

  it('parses search query', () => {
    const { query } = deserializeFilters('#q=magic');
    expect(query).toBe('magic');
  });

  it('ignores unknown parameters', () => {
    const { filters, query } = deserializeFilters('#unknown=value');
    expect(query).toBe('');
    for (const dim of DIMENSION_CONFIG) {
      expect(filters[dim.key].size).toBe(0);
    }
  });
});

describe('round-trip', () => {
  it('serialize then deserialize preserves state', () => {
    const original = createEmptyFilters();
    original.obstruction = new Set(['Bloaters', 'Couplers']);
    original.expanse = new Set(['Within']);
    original.smell_hierarchies = new Set(['Code Smell']);

    const hash = serializeFilters(original, 'test query');
    const { filters, query } = deserializeFilters(hash);

    expect(query).toBe('test query');
    expect([...filters.obstruction].sort((a, b) => a.localeCompare(b))).toEqual([
      'Bloaters',
      'Couplers',
    ]);
    expect([...filters.expanse]).toEqual(['Within']);
    expect([...filters.smell_hierarchies]).toEqual(['Code Smell']);
  });

  it('handles special characters in values', () => {
    const filters = createEmptyFilters();
    filters.obstruction = new Set(['Object Oriented Abusers']);

    const hash = serializeFilters(filters, '');
    const { filters: parsed } = deserializeFilters(hash);

    expect(parsed.obstruction.has('Object Oriented Abusers')).toBe(true);
  });
});
