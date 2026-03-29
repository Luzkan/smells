import { describe, expect, it } from 'vitest';
import type { Root } from 'mdast';
import astroConfig from '../../../astro.config.mjs';
import remarkSmellLinks from '../../../src/plugins/remark-smell-links';
import remarkOverviewHeading from '../../../src/plugins/remark-overview-heading';
import remarkStripSections from '../../../src/plugins/remark-strip-sections';
import remarkCalloutSections from '../../../src/plugins/remark-callout-sections';
import { extractPlainText } from '../../../src/plugins/mdast-utils';

function headingText(node: Root['children'][number]): string {
  if (node.type !== 'heading') return '';
  return extractPlainText(node.children);
}

function paragraphText(node: Root['children'][number]): string {
  if (node.type !== 'paragraph') return '';
  return extractPlainText(node.children);
}

describe('remark pipeline ordering', () => {
  it('keeps the load-bearing plugin order in astro config', () => {
    const plugins = astroConfig.markdown?.remarkPlugins ?? [];
    expect(plugins).toEqual([
      remarkSmellLinks,
      remarkOverviewHeading,
      remarkStripSections,
      remarkCalloutSections,
    ]);
  });

  it('produces stable output with strip/callout ordering and bounded sources stripping', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'Dead Code' }],
        },
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: 'Read ' },
            {
              type: 'link',
              url: './long-method.md',
              children: [{ type: 'text', value: 'Long Method' }],
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Problems' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Problem details.' }],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Causation' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Because reasons.' }],
        },
        {
          type: 'heading',
          depth: 5,
          children: [{ type: 'text', value: 'Sources' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Source A' }],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'Appendix' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Should survive.' }],
        },
      ],
    };

    const file = { data: {} as Record<string, unknown> };
    remarkSmellLinks()(tree);
    remarkOverviewHeading()(tree);
    remarkStripSections()(tree, file);
    remarkCalloutSections()(tree);

    const headings = tree.children.filter((node) => node.type === 'heading');
    const texts = headings.map((node) => headingText(node));

    expect(texts).toContain('Overview');
    expect(texts).toContain('Appendix');
    expect(texts).not.toContain('Problems');
    expect(texts).not.toContain('Sources');

    const paragraph = tree.children.find((node) => node.type === 'paragraph');
    const linkNode =
      paragraph?.type === 'paragraph'
        ? paragraph.children.find((child) => child.type === 'link')
        : null;
    expect(linkNode?.type === 'link' ? linkNode.url : null).toBe('/smells/long-method');

    const hasCallout = tree.children.some(
      (node) => node.type === 'html' && /class="callout"/.test(node.value),
    );
    expect(hasCallout).toBe(true);

    const sectionData = file.data.articleSections as { stripped?: string[] } | undefined;
    expect(sectionData?.stripped).toEqual(expect.arrayContaining(['problems', 'sources']));
  });

  it('strips full Example sections with multiple example blocks and preserves callouts', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [{ type: 'text', value: 'Magic Number' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Overview text.' }],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Causation' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Because reasons.' }],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Examples' }],
        },
        { type: 'html', value: '<div class="example-block">' },
        {
          type: 'heading',
          depth: 4,
          children: [{ type: 'text', value: 'Smelly' }],
        },
        {
          type: 'code',
          lang: 'ts',
          value: 'const damage = 100;',
        },
        { type: 'html', value: '</div>' },
        { type: 'html', value: '<div class="example-block">' },
        {
          type: 'heading',
          depth: 4,
          children: [{ type: 'text', value: 'Solution' }],
        },
        {
          type: 'code',
          lang: 'ts',
          value: 'const MAX_DAMAGE = 100;',
        },
        { type: 'html', value: '</div>' },
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'Notes' }],
        },
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Should survive.' }],
        },
      ],
    };

    const file = { data: {} as Record<string, unknown> };
    remarkSmellLinks()(tree);
    remarkOverviewHeading()(tree);
    remarkStripSections()(tree, file);
    remarkCalloutSections()(tree);

    const headings = tree.children.filter((node) => node.type === 'heading');
    const texts = headings.map((node) => headingText(node));
    expect(texts).toContain('Overview');
    expect(texts).toContain('Notes');
    expect(texts).not.toContain('Examples');

    const hasExampleBlock = tree.children.some(
      (node) => node.type === 'html' && /example-block/.test(node.value),
    );
    expect(hasExampleBlock).toBe(false);

    const calloutOpen = tree.children.find(
      (node) => node.type === 'html' && /class="callout"/.test(node.value),
    );
    expect(calloutOpen).toBeTruthy();

    const paragraphs = tree.children
      .filter((node) => node.type === 'paragraph')
      .map((node) => paragraphText(node));
    expect(paragraphs).toEqual(expect.arrayContaining(['Because reasons.', 'Should survive.']));

    const sectionData = file.data.articleSections as { stripped?: string[] } | undefined;
    expect(sectionData?.stripped).toEqual(expect.arrayContaining(['example']));
  });
});
