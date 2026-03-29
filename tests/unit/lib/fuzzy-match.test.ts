import { describe, expect, it } from 'vitest';
import { levenshtein, findBestMatch } from '../../../src/lib/404/fuzzy-match';

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('abc', 'abc')).toBe(0);
  });

  it('returns the length of the other string when one is empty', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('xyz', '')).toBe(3);
  });

  it('returns 0 for two empty strings', () => {
    expect(levenshtein('', '')).toBe(0);
  });

  it('computes single-character edits', () => {
    expect(levenshtein('cat', 'bat')).toBe(1);
    expect(levenshtein('cat', 'ca')).toBe(1);
    expect(levenshtein('cat', 'cats')).toBe(1);
  });

  it('computes multi-character edits', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('sunday', 'saturday')).toBe(3);
  });
});

describe('findBestMatch', () => {
  const candidates = [
    { slug: 'dead-code', name: 'Dead Code' },
    { slug: 'feature-envy', name: 'Feature Envy' },
    { slug: 'large-class', name: 'Large Class' },
    { slug: 'long-method', name: 'Long Method' },
  ];

  it('finds an exact slug match (distance 0) and returns null', () => {
    const result = findBestMatch('dead-code', candidates);
    expect(result).toBeNull();
  });

  it('finds a close match within threshold', () => {
    const result = findBestMatch('dead-cod', candidates);
    expect(result).not.toBeNull();
    expect(result!.candidate.slug).toBe('dead-code');
    expect(result!.distance).toBe(1);
  });

  it('returns null when no match is within threshold', () => {
    const result = findBestMatch('zzzzzzzzz', candidates);
    expect(result).toBeNull();
  });

  it('finds the closest match among multiple candidates', () => {
    const result = findBestMatch('featur-envy', candidates);
    expect(result).not.toBeNull();
    expect(result!.candidate.slug).toBe('feature-envy');
  });

  it('handles single-character path', () => {
    const result = findBestMatch('a', candidates);
    expect(result).toBeNull();
  });

  it('uses custom threshold parameters', () => {
    const strict = findBestMatch('dead-codexyz', candidates, 0.1, 0);
    expect(strict).toBeNull();

    const lenient = findBestMatch('dead-codexyz', candidates, 0.5, 5);
    expect(lenient).not.toBeNull();
  });
});
