/**
 * Remark plugin: wrap Causation section in a `.callout` card.
 *
 * Exceptions are handled separately — stripped by remark-strip-sections,
 * extracted at build time, and placed explicitly in the template.
 */
import type { Root } from 'mdast';
import { extractPlainText, isSectionBreak } from './mdast-utils';

interface CalloutConfig {
  id: string;
  label: string;
  headingText: string;
  pattern: RegExp;
}

const CALLOUTS: CalloutConfig[] = [
  {
    id: 'causation',
    label: 'Why This Happens',
    headingText: 'Causation',
    pattern: /^Causation:?\s*$/,
  },
];

function findHeadingIndex(children: Root['children'], config: CalloutConfig): number {
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type !== 'heading' || node.depth !== 3) continue;
    if (config.pattern.test(extractPlainText(node.children))) return i;
  }
  return -1;
}

function buildCalloutHtml(config: CalloutConfig): { open: string; close: string } {
  const open =
    `<div class="callout" id="${config.id}" role="note">` +
    `<h3 class="sr-only">${config.headingText}</h3>` +
    `<div class="callout-label" aria-hidden="true">${config.label}</div>`;
  return { open, close: '</div>' };
}

function wrapCallout(children: Root['children'], config: CalloutConfig): void {
  const i = findHeadingIndex(children, config);
  if (i === -1) return;

  let end = i + 1;
  while (end < children.length && !isSectionBreak(children[end], 3)) end++;

  const { open, close } = buildCalloutHtml(config);
  const contentNodes = children.slice(i + 1, end);

  children.splice(i, end - i, { type: 'html', value: open }, ...contentNodes, {
    type: 'html',
    value: close,
  });
}

export default function remarkCalloutSections() {
  return (tree: Root) => {
    for (const config of CALLOUTS) {
      wrapCallout(tree.children, config);
    }
  };
}
