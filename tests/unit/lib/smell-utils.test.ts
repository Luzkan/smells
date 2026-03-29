import { describe, expect, it } from 'vitest';
import {
  groupRelationsByType,
  toSmellLink,
  sortSmellsByTitle,
  type RelatedSmell,
} from '../../../src/lib/content/smell-utils';
import { makeCollectionEntry, type SmellCollectionEntry } from '../fixtures';

type SmellLinkEntry = Parameters<typeof toSmellLink>[0];
type SortEntry = Parameters<typeof sortSmellsByTitle>[0][number];

function asEntry(entry: SmellCollectionEntry): SmellLinkEntry {
  return entry as unknown as SmellLinkEntry;
}

function asEntries(entries: SmellCollectionEntry[]): SortEntry[] {
  return entries as unknown as SortEntry[];
}

function makeRelation(name: string, slug: string, type: RelatedSmell['type']): RelatedSmell {
  return { name, slug, type };
}

describe('groupRelationsByType', () => {
  it('returns an empty object when there are no relations', () => {
    expect(groupRelationsByType([])).toEqual({});
  });

  it('groups a smell under every relation type it declares', () => {
    const grouped = groupRelationsByType([
      makeRelation('Feature Envy', 'feature-envy', ['causes', 'co-exist']),
      makeRelation('Large Class', 'large-class', ['causes']),
    ]);

    expect(grouped).toEqual({
      causes: ['Feature Envy', 'Large Class'],
      'co-exist': ['Feature Envy'],
    });
  });

  it('supports all known relation types', () => {
    const grouped = groupRelationsByType([
      makeRelation('Long Method', 'long-method', ['causes']),
      makeRelation('Shotgun Surgery', 'shotgun-surgery', ['caused']),
      makeRelation('Feature Envy', 'feature-envy', ['co-exist']),
      makeRelation('Large Class', 'large-class', ['family']),
      makeRelation('Data Clumps', 'data-clumps', ['antagonistic']),
    ]);

    expect(grouped.causes).toEqual(['Long Method']);
    expect(grouped.caused).toEqual(['Shotgun Surgery']);
    expect(grouped['co-exist']).toEqual(['Feature Envy']);
    expect(grouped.family).toEqual(['Large Class']);
    expect(grouped.antagonistic).toEqual(['Data Clumps']);
  });
});

describe('toSmellLink', () => {
  it('maps a collection entry to a SmellLink', () => {
    const link = toSmellLink(
      asEntry(
        makeCollectionEntry({
          data: {
            meta: {
              description: 'Feature Envy authored description.',
            },
          },
        }),
      ),
    );

    expect(link).toEqual({
      slug: 'feature-envy',
      href: '/smells/feature-envy',
      title: 'Feature Envy',
      obstruction: 'Bloaters',
      occurrence: 'Measured Smells',
      description: 'Feature Envy authored description.',
    });
  });

  it('uses the first obstruction and occurrence values', () => {
    const entry = makeCollectionEntry({
      data: {
        categories: {
          expanse: 'Within',
          obstruction: ['Bloaters', 'Couplers'],
          occurrence: ['Duplication', 'Responsibility'],
          smell_hierarchies: ['Code Smell'],
          tags: [],
        },
      },
    });

    const link = toSmellLink(asEntry(entry));
    expect(link.obstruction).toBe('Bloaters');
    expect(link.occurrence).toBe('Duplication');
  });

  it('uses fixed description length', () => {
    const link = toSmellLink(asEntry(makeCollectionEntry()));
    expect(link.description.length).toBeGreaterThan(0);
    expect(link.description.length).toBeLessThanOrEqual(120);
  });

  it('prefers authored meta.description when present', () => {
    const link = toSmellLink(
      asEntry(
        makeCollectionEntry({
          data: {
            meta: {
              description: 'Authored description for prev/next navigation.',
            },
          },
          body: 'Fallback body that should not be used.',
        }),
      ),
    );

    expect(link.description).toBe('Authored description for prev/next navigation.');
  });

  it('throws on empty body', () => {
    expect(() => toSmellLink(asEntry(makeCollectionEntry({ body: '' })))).toThrow(
      'has no body content',
    );
  });

  it('throws on undefined body', () => {
    expect(() =>
      toSmellLink(asEntry(makeCollectionEntry({ body: undefined as unknown as string }))),
    ).toThrow('has no body content');
  });
});

describe('sortSmellsByTitle', () => {
  it('sorts entries alphabetically by title', () => {
    const entries = [
      makeCollectionEntry({ data: { meta: { title: 'Zebra' } } }),
      makeCollectionEntry({ data: { meta: { title: 'Alpha' } } }),
      makeCollectionEntry({ data: { meta: { title: 'Middle' } } }),
    ];

    const sorted = sortSmellsByTitle(asEntries(entries));
    expect(sorted.map((e) => e.data.meta.title)).toEqual(['Alpha', 'Middle', 'Zebra']);
  });

  it('does not mutate the original array', () => {
    const entries = [
      makeCollectionEntry({ data: { meta: { title: 'B' } } }),
      makeCollectionEntry({ data: { meta: { title: 'A' } } }),
    ];
    const original = [...entries];

    sortSmellsByTitle(asEntries(entries));
    expect(entries.map((e) => e.data.meta.title)).toEqual(original.map((e) => e.data.meta.title));
  });
});
