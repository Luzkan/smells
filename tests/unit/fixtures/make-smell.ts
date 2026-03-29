import type { SmellEntry } from '../../../src/lib/types';

export type SmellOverrides = Omit<Partial<SmellEntry>, 'meta' | 'categories'> & {
  meta?: Partial<SmellEntry['meta']>;
  categories?: Partial<SmellEntry['categories']>;
};

export function makeSmell(overrides: SmellOverrides = {}): SmellEntry {
  const base: SmellEntry = {
    slug: 'feature-envy',
    meta: {
      last_update_date: new Date('2024-01-01'),
      title: 'Feature Envy',
      known_as: ['Method Envy'],
    },
    categories: {
      expanse: 'Within',
      obstruction: ['Bloaters'],
      occurrence: ['Measured Smells'],
      smell_hierarchies: ['Code Smell'],
      tags: [],
    },
    relations: {
      related_smells: [{ name: 'Data Clumps', slug: 'data-clumps', type: ['family'] }],
    },
    problems: {
      general: [],
      violation: {
        principles: [],
        patterns: [],
      },
    },
    refactors: ['Move Method', 'Extract Method'],
    history: [
      {
        author: 'Martin Fowler',
        type: 'mention',
        source: {
          year: 1999,
          authors: ['Martin Fowler'],
          name: 'Refactoring',
          type: 'book',
        },
      },
      {
        author: 'Kent Beck',
        type: 'origin',
        source: {
          year: 2000,
          authors: ['Kent Beck'],
          name: 'Smalltalk Best Practice Patterns',
          type: 'book',
        },
      },
    ],
  };

  return {
    ...base,
    ...overrides,
    meta: {
      ...base.meta,
      ...(overrides.meta ?? {}),
    },
    categories: {
      ...base.categories,
      ...(overrides.categories ?? {}),
    },
    relations: overrides.relations ?? base.relations,
    problems: overrides.problems ?? base.problems,
    refactors: overrides.refactors ?? base.refactors,
    history: overrides.history ?? base.history,
  };
}
