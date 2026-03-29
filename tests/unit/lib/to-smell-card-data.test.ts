import { describe, expect, it } from 'vitest';
import { toSmellCardData } from '../../../src/lib/content/to-smell-card-data';
import { makeSmell } from '../fixtures';

describe('toSmellCardData', () => {
  it('maps smell entry fields to SmellCardData', () => {
    const smell = makeSmell();
    const card = toSmellCardData(smell, 'A short description');

    expect(card).toEqual({
      slug: 'feature-envy',
      title: 'Feature Envy',
      knownAs: ['Method Envy'],
      obstruction: ['Bloaters'],
      occurrence: ['Measured Smells'],
      smellHierarchies: ['Code Smell'],
      expanse: 'Within',
      description: 'A short description',
      refactorCount: 2,
      relatedCount: 1,
      originInfo: 'Beck, 2000',
    });
  });

  it('falls back to first history entry when no origin type exists', () => {
    const smell = makeSmell({
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
      ],
    });

    const card = toSmellCardData(smell, 'Description');
    expect(card.originInfo).toBe('Fowler, 1999');
  });

  it('returns empty originInfo when history is empty', () => {
    const smell = makeSmell({ history: [] });
    const card = toSmellCardData(smell, 'Description');
    expect(card.originInfo).toBe('');
  });
});
