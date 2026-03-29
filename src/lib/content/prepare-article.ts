import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import type { ObstructionCategory } from '../constants';
import type { ProblemDescription } from './extract-problems';
import type { CodeBlockData } from './highlight';
import { extractCodeExamples, getLangDisplayName, renderCode } from './highlight';
import { extractExceptionText, extractProblemDescriptions } from './extract-problems';
import { resolveSmellDescription } from './extract-description';
import { parseArticleSections } from './article-sections-parser';
import { buildArticleTocHeadings } from './article-sections';
import { getBody, getPrimaryObstruction } from './smell-utils';

const READING_SPEED_WPM = 200;
const META_DESC_MAX_LENGTH = 200;

type RenderedCodeBlock = Omit<CodeBlockData, 'code' | 'markers'> & { html: string };

type RenderedArticleExample =
  | { kind: 'smelly-only'; smelly: RenderedCodeBlock }
  | { kind: 'with-solution'; smelly: RenderedCodeBlock; solution: RenderedCodeBlock };

interface ArticleViewData {
  rawBody: string;
  wordCount: number;
  readTime: number;
  sourceCount: number;
  primaryObstruction: ObstructionCategory;
  renderedExamples: RenderedArticleExample[];
  problemDescriptions: ProblemDescription[];
  exceptionHtml: string | null;
  tocHeadings: MarkdownHeading[];
  description: string;
}

export async function prepareArticleData(
  entry: CollectionEntry<'smells'>,
  headings: MarkdownHeading[],
): Promise<ArticleViewData> {
  const rawBody = getBody(entry);
  const parsedSections = parseArticleSections(rawBody);

  const wordCount = rawBody
    .replaceAll(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / READING_SPEED_WPM));

  const sourceCount = entry.data.history.length;
  const primaryObstruction = getPrimaryObstruction(entry.data.categories);

  const codeExamples = extractCodeExamples(rawBody);
  const problemDescriptions = extractProblemDescriptions(parsedSections);
  const exceptionHtml = extractExceptionText(parsedSections);

  const renderedExamples = await Promise.all(
    codeExamples.map(async (example) => {
      const smelly: RenderedCodeBlock = {
        html: await renderCode(example.smelly.code, example.smelly.lang, {
          markers: example.smelly.markers,
          markerClass: 'smell-mark',
        }),
        lang: getLangDisplayName(example.smelly.lang),
        caption: example.smelly.caption,
      };

      if (example.kind === 'smelly-only') {
        return { kind: 'smelly-only', smelly } as const;
      }

      return {
        kind: 'with-solution',
        smelly,
        solution: {
          html: await renderCode(example.solution.code, example.solution.lang, {
            markers: example.solution.markers,
            markerClass: 'fix-mark',
          }),
          lang: example.solution.lang ? getLangDisplayName(example.solution.lang) : '',
          caption: example.solution.caption,
        },
      } as const;
    }),
  );

  const titleSlug = headings.find((heading) => heading.depth === 2)?.slug ?? entry.data.slug;
  const hasProblems =
    problemDescriptions.length > 0 ||
    entry.data.problems.general.length > 0 ||
    entry.data.problems.violation.principles.length > 0 ||
    entry.data.problems.violation.patterns.length > 0;

  const tocHeadings = buildArticleTocHeadings(titleSlug, {
    hasProblems,
    hasExamples: renderedExamples.length > 0,
    hasRefactoring: entry.data.refactors.length > 0,
    hasSources: entry.data.history.length > 0,
  });

  const description = resolveSmellDescription(
    entry.data.meta.description,
    parsedSections,
    META_DESC_MAX_LENGTH,
    entry.data.slug,
  );

  return {
    rawBody,
    wordCount,
    readTime,
    sourceCount,
    primaryObstruction,
    renderedExamples,
    problemDescriptions,
    exceptionHtml,
    tocHeadings,
    description,
  };
}
