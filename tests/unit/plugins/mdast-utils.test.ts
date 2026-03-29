import { describe, expect, it } from 'vitest';
import type { PhrasingContent } from 'mdast';
import { extractPlainText } from '../../../src/plugins/mdast-utils';

describe('extractPlainText', () => {
  it('extracts plain text from flat text nodes', () => {
    const nodes: PhrasingContent[] = [{ type: 'text', value: 'Problems' }];

    expect(extractPlainText(nodes)).toBe('Problems');
  });

  it('extracts nested text from emphasis, strong, and links', () => {
    const nodes: PhrasingContent[] = [
      {
        type: 'strong',
        children: [{ type: 'text', value: 'Bold' }],
      },
      { type: 'text', value: ' + ' },
      {
        type: 'emphasis',
        children: [{ type: 'text', value: 'Italic' }],
      },
      { type: 'text', value: ' + ' },
      {
        type: 'link',
        url: '/smells/dead-code',
        children: [{ type: 'text', value: 'Link' }],
      },
    ];

    expect(extractPlainText(nodes)).toBe('Bold + Italic + Link');
  });
});
