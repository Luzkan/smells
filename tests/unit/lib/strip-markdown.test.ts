import { describe, expect, it } from 'vitest';
import { stripMarkdownFormatting } from '../../../src/lib/content/strip-markdown';

describe('stripMarkdownFormatting', () => {
  it('strips links, emphasis, and inline code markers', () => {
    const input =
      'Read [Guide](https://example.com) with **bold**, *italic*, __loud__, _soft_, and `const x = 1`.';

    expect(stripMarkdownFormatting(input)).toBe(
      'Read Guide with bold, italic, loud, soft, and const x = 1.',
    );
  });

  it('keeps snake_case tokens while removing underscore emphasis', () => {
    const input = 'Use snake_case identifiers, but render _labels_ and __headings__ as plain text.';

    expect(stripMarkdownFormatting(input)).toBe(
      'Use snake_case identifiers, but render labels and headings as plain text.',
    );
  });
});
