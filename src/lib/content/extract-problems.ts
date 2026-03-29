/**
 * Build-time extraction of problem descriptions from markdown body.
 *
 * Parses ### Problems section into structured data for ProblemCards.
 * Follows the same pattern as extractCodeExamples in highlight.ts.
 */
import { rewriteSmellHref } from './markdown-utils';
import { findSectionLines, type ParsedArticleSections } from './article-sections-parser';

export interface ProblemDescription {
  heading: string;
  headingHref?: string;
  descriptionHtml: string;
}

const PROBLEMS_HEADING = /^Problems:?\s*$/i;
const SUB_HEADING = /^####\s+(.+)$/;
const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const EXCEPTIONS_HEADING = /^Exceptions?:?\s*$/i;
const ANY_HEADING = /^#{1,5}\s+/;

function cleanHeading(raw: string): { heading: string; headingHref?: string } {
  const stripped = raw.replaceAll('**', '').trim();

  const linkMatch = MD_LINK.exec(stripped);
  if (linkMatch) {
    const text = linkMatch[1];
    const url = linkMatch[2];
    const href = rewriteSmellHref(url);
    return { heading: text, headingHref: href };
  }

  return { heading: stripped };
}

/**
 * Convert inline markdown to HTML. Handles: `code`, **bold**, _italic_,
 * [link](url), and bullet lists. Rewrites ./slug.md links to /smells/slug.
 */
function inlineMarkdown(text: string): string {
  return text
    .replaceAll(/`([^`]+)`/g, '<code>$1</code>')
    .replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replaceAll(/_([^_]+)_/g, '<em>$1</em>')
    .replaceAll(/\[([^\]]+)\]\(\.\/([^)]+)\.(md|markdown)\)/g, '<a href="/smells/$2">$1</a>')
    .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function descriptionToHtml(lines: string[]): string {
  const trimmed = lines.filter((l) => l.trim().length > 0);
  if (trimmed.length === 0) return '';

  const isList = trimmed.every((l) => l.trim().startsWith('- '));
  if (isList) {
    const items = trimmed.map((l) => `<li>${inlineMarkdown(l.trim().slice(2))}</li>`);
    return `<ul>${items.join('')}</ul>`;
  }

  return trimmed.map((l) => inlineMarkdown(l.trim())).join(' ');
}

function splitIntoParagraphs(lines: string[]): string[][] {
  const result: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length > 0) result.push(current);
      current = [];
    } else {
      current.push(line.trim());
    }
  }
  if (current.length > 0) result.push(current);
  return result;
}

function collectUntilHeadingBoundary(lines: string[]): string[] {
  const idx = lines.findIndex((line) => ANY_HEADING.test(line));
  return idx === -1 ? lines : lines.slice(0, idx);
}

/**
 * Extract the Exceptions section text from raw markdown, converting
 * paragraphs to HTML with inline markdown support and smell-link rewriting.
 * Returns null if the article has no Exceptions section.
 */
export function extractExceptionText(source: ParsedArticleSections): string | null {
  const exceptionLines = findSectionLines(source, EXCEPTIONS_HEADING);
  if (!exceptionLines) return null;

  const paragraphs = splitIntoParagraphs(collectUntilHeadingBoundary(exceptionLines));
  if (paragraphs.length === 0) return null;

  return paragraphs.map((p) => `<p>${inlineMarkdown(p.join(' '))}</p>`).join('\n');
}

type ProblemAcc = {
  results: ProblemDescription[];
  heading: { heading: string; headingHref?: string } | null;
  desc: string[];
};

function flushProblem(acc: ProblemAcc): ProblemDescription[] {
  return acc.heading
    ? [...acc.results, { ...acc.heading, descriptionHtml: descriptionToHtml(acc.desc) }]
    : acc.results;
}

export function extractProblemDescriptions(source: ParsedArticleSections): ProblemDescription[] {
  const allLines = findSectionLines(source, PROBLEMS_HEADING);
  if (!allLines) return [];

  // Stop at the first non-sub heading (e.g. ### that isn't ####)
  const boundaryIdx = allLines.findIndex(
    (line) => ANY_HEADING.test(line) && !SUB_HEADING.test(line),
  );
  const lines = boundaryIdx === -1 ? allLines : allLines.slice(0, boundaryIdx);

  const final = lines.reduce<ProblemAcc>(
    (acc, line) => {
      const subMatch = SUB_HEADING.exec(line);
      if (subMatch) {
        return { results: flushProblem(acc), heading: cleanHeading(subMatch[1]), desc: [] };
      }
      if (acc.heading) {
        return { ...acc, desc: [...acc.desc, line] };
      }
      return acc;
    },
    { results: [], heading: null, desc: [] },
  );

  return flushProblem(final);
}
