import type { Root, PhrasingContent } from 'mdast';

type PhrasingParent = PhrasingContent & { children: PhrasingContent[] };

function hasChildren(node: PhrasingContent): node is PhrasingParent {
  return 'children' in node && Array.isArray((node as { children?: unknown }).children);
}

/** Extract plain text from an array of phrasing content nodes. */
export function extractPlainText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if ('value' in node) return node.value;
      if (hasChildren(node)) {
        return extractPlainText(node.children);
      }
      return '';
    })
    .join('');
}

export function isSectionBreak(node: Root['children'][number], maxHeadingDepth: number): boolean {
  if (node.type === 'heading' && node.depth <= maxHeadingDepth) return true;
  if (node.type === 'thematicBreak') return true;
  if (node.type === 'html' && /<div\b/.test(node.value)) return true;
  return false;
}
