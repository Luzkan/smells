import { makeSmell, type SmellOverrides } from './make-smell';
import type { SmellEntry } from '../../../src/lib/types';

export type SmellCollectionEntry = {
  id: string;
  collection: 'smells';
  body: string;
  data: SmellEntry;
};

type CollectionEntryOverrides = Partial<Omit<SmellCollectionEntry, 'data'>> & {
  data?: SmellOverrides;
};

export function makeCollectionEntry(
  overrides: CollectionEntryOverrides = {},
): SmellCollectionEntry {
  const { data: dataOverrides, ...rest } = overrides;
  return {
    id: 'feature-envy',
    collection: 'smells' as const,
    body: 'Feature Envy is a method that seems more interested in a class other than the one it actually is in.',
    ...rest,
    data: makeSmell(dataOverrides),
  };
}
