import type { MarkdownHeading } from 'astro';

type ArticleSectionId = 'problems' | 'example' | 'refactoring' | 'exceptions' | 'sources';

export interface ArticleSectionRule {
  id: ArticleSectionId;
  tocLabel: string;
  slug: string;
  depth: number;
  headingPattern: RegExp;
  action: 'strip' | 'callout';
}

const ARTICLE_SECTIONS: ArticleSectionRule[] = [
  {
    id: 'problems',
    tocLabel: 'Problems',
    slug: 'problems',
    depth: 3,
    headingPattern: /^Problems:?\s*$/,
    action: 'strip',
  },
  {
    id: 'example',
    tocLabel: 'Example',
    slug: 'example',
    depth: 3,
    headingPattern: /^Examples?:?\s*$/,
    action: 'strip',
  },
  {
    id: 'refactoring',
    tocLabel: 'Refactoring',
    slug: 'refactoring',
    depth: 3,
    headingPattern: /^Refactoring:?\s*$/,
    action: 'strip',
  },
  {
    id: 'exceptions',
    tocLabel: 'Exceptions',
    slug: 'exceptions',
    depth: 3,
    headingPattern: /^Exceptions?:?\s*$/,
    action: 'strip',
  },
  {
    id: 'sources',
    tocLabel: 'Sources',
    slug: 'sources',
    depth: 5,
    headingPattern: /^Sources$/,
    action: 'strip',
  },
];

export const STRIPPED_ARTICLE_SECTIONS = ARTICLE_SECTIONS.filter(
  (section) => section.action === 'strip',
);

interface ArticleTocPresence {
  hasProblems: boolean;
  hasExamples: boolean;
  hasRefactoring: boolean;
  hasSources: boolean;
}

export function buildArticleTocHeadings(
  titleSlug: string,
  presence: ArticleTocPresence,
): MarkdownHeading[] {
  const toc: MarkdownHeading[] = [{ depth: 2, slug: titleSlug, text: 'Overview' }];

  if (presence.hasProblems) {
    toc.push({ depth: 2, slug: 'problems', text: 'Problems' });
  }
  if (presence.hasExamples) {
    toc.push({ depth: 2, slug: 'example', text: 'Example' });
  }
  if (presence.hasRefactoring) {
    toc.push({ depth: 2, slug: 'refactoring', text: 'Refactoring' });
  }
  if (presence.hasSources) {
    toc.push({ depth: 2, slug: 'sources', text: 'Sources' });
  }

  return toc;
}
