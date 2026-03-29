const MD_HREF_RE = /\.\/(.+)\.(md|markdown)$/;

export function rewriteSmellHref(href: string): string {
  const match = MD_HREF_RE.exec(href);
  return match ? `/smells/${match[1]}` : href;
}
