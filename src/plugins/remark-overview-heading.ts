/**
 * Remark plugin: normalize the first article H2 to "Overview".
 *
 * Content files keep their original first heading (typically the smell title),
 * but the rendered article body uses a single canonical heading that matches
 * the design mockup and avoids repeating the hero title.
 */
import type { Root } from 'mdast';
import { extractPlainText } from './mdast-utils';

const OVERVIEW_HEADING = 'Overview';
const OVERVIEW_RE = /^Overview:?\s*$/i;

export default function remarkOverviewHeading() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== 'heading' || node.depth !== 2) continue;

      // Keep idempotent behavior when content is already normalized.
      if (OVERVIEW_RE.test(extractPlainText(node.children))) return;

      node.children = [{ type: 'text', value: OVERVIEW_HEADING }];
      return;
    }
  };
}
