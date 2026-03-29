/**
 * Remark plugin: rewrite internal markdown links to site URLs.
 *
 * Converts `[Name](./slug.md)` to `[Name](/smells/slug)`.
 * Port of the Gatsby `gatsby-remark-markdown-linker` plugin.
 */
import { visit } from 'unist-util-visit';
import type { Root, Link } from 'mdast';
import { rewriteSmellHref } from '../lib/content/markdown-utils';

export default function remarkSmellLinks() {
  return (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      node.url = rewriteSmellHref(node.url);
    });
  };
}
