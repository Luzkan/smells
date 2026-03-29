import { findOriginOrEarliestEntry } from './smell-utils';
import type { SmellCardData } from '../types';
import type { SmellFrontmatter } from '../../schemas/smell';

export function toSmellCardData(data: SmellFrontmatter, description: string): SmellCardData {
  const origin = data.history.length > 0 ? findOriginOrEarliestEntry(data.history) : null;
  const originInfo = origin ? `${origin.author.split(' ').at(-1)}, ${origin.source.year}` : '';

  return {
    slug: data.slug,
    title: data.meta.title,
    knownAs: data.meta.known_as,
    obstruction: data.categories.obstruction,
    occurrence: data.categories.occurrence,
    smellHierarchies: data.categories.smell_hierarchies,
    expanse: data.categories.expanse,
    description,
    refactorCount: data.refactors.length,
    relatedCount: data.relations.related_smells.length,
    originInfo,
  };
}
