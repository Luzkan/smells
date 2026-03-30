function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildArticleBibtex(
  slug: string,
  title: string,
  author: string,
  year: number,
  url: string,
): string {
  const key = slug.replaceAll('-', '');
  return `@misc{jerzyk${year}${key},\n  title  = {${title} — Code Smells Catalog},\n  author = {${author}},\n  year   = {${year}},\n  url    = {${url}}\n}`;
}

/**
 * Transforms a plain BibTeX string into syntax-highlighted HTML.
 * Entry type, field names, and delimiters get wrapped in <span> elements
 * for visual hierarchy. Plain text is preserved for clipboard via textContent.
 */
export function formatBibtexHtml(bibtex: string): string {
  const delim = (s: string) => `<span class="cite-bib-delim">${s}</span>`;
  const key = (s: string) => `<span class="cite-bib-key">${s}</span>`;
  const type = (s: string) => `<span class="cite-bib-type">${s}</span>`;

  return bibtex
    .split('\n')
    .map((line) => {
      if (line.startsWith('@')) {
        return line.replace(/@(\w+)/, (_, t: string) => type(`@${t}`)).replace(/\{/, delim('{'));
      }
      if (/^\}$/.test(line)) return delim('}');
      const m = /^(\s+)(\w+)(\s*)(=)(\s*)(\{)([^}]*)(\})(,?)$/.exec(line);
      if (!m) return escapeHtml(line);
      return `${m[1]}${key(m[2])}${m[3]}${delim(m[4])}${m[5]}${delim(m[6])}${escapeHtml(m[7])}${delim(m[8])}${m[9]}`;
    })
    .join('\n');
}
