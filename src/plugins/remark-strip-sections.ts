/**
 * Remark plugin: strip body sections rendered by dedicated Astro components.
 *
 * Removes `##### Sources` (+ preceding thematic break), `### Refactoring`,
 * `### Problems`, `### Example(s)`, and `### Exception(s)` from the
 * markdown AST so they don't duplicate the explicit Astro components
 * that render each section in controlled order.
 * Content files stay untouched — stripping happens at build time only.
 */
import type { Root, Heading } from 'mdast';
import {
  STRIPPED_ARTICLE_SECTIONS,
  type ArticleSectionRule,
} from '../lib/content/article-sections';
import { extractPlainText, isSectionBreak } from './mdast-utils';

function matchesHeading(heading: Heading, depth: number, pattern: RegExp): boolean {
  return heading.depth === depth && pattern.test(extractPlainText(heading.children));
}

function isExampleBlockWrapper(node: Root['children'][number]): boolean {
  return (
    node.type === 'html' &&
    /<div\b[^>]*class=(['"])[^'"]*\bexample-block\b[^'"]*\1/i.test(node.value)
  );
}

function isStripSectionBreak(node: Root['children'][number], maxHeadingDepth: number): boolean {
  if (isExampleBlockWrapper(node)) return false;
  return isSectionBreak(node, maxHeadingDepth);
}

function stripSection(children: Root['children'], rule: ArticleSectionRule): boolean {
  for (let i = children.length - 1; i >= 0; i--) {
    const node = children[i];
    if (node.type !== 'heading') continue;
    if (!matchesHeading(node, rule.depth, rule.headingPattern)) continue;

    let end = i + 1;
    while (end < children.length) {
      if (isStripSectionBreak(children[end], rule.depth)) break;
      end++;
    }

    children.splice(i, end - i);

    // Keep output tidy: if Sources had a leading thematic break, strip it too.
    if (rule.id === 'sources' && i > 0 && children[i - 1]?.type === 'thematicBreak') {
      children.splice(i - 1, 1);
    }
    return true;
  }
  return false;
}

function sortedStripRules(): ArticleSectionRule[] {
  return [...STRIPPED_ARTICLE_SECTIONS].sort((a, b) => b.depth - a.depth);
}

export default function remarkStripSections() {
  return (tree: Root, file?: { data?: Record<string, unknown> }) => {
    const stripped = sortedStripRules()
      .filter((rule) => stripSection(tree.children, rule))
      .map((rule) => rule.id);

    if (!file) return;
    const raw = file.data?.articleSections;
    const fallback: Record<string, unknown> = {};
    const previous = typeof raw === 'object' && raw !== null ? raw : fallback;
    file.data = {
      ...file.data,
      articleSections: {
        ...previous,
        stripped,
      },
    };
  };
}
