interface ParsedArticleSection {
  heading: string;
  lines: string[];
}

export interface ParsedArticleSections {
  overviewLines: string[];
  sections: ParsedArticleSection[];
}

const H3_HEADING_RE = /^###\s+(.+)$/;

export function parseArticleSections(rawBody: string): ParsedArticleSections {
  const lines = rawBody.split('\n');
  const overviewLines: string[] = [];
  const sections: ParsedArticleSection[] = [];
  let currentSection: ParsedArticleSection | null = null;

  for (const line of lines) {
    const headingMatch = H3_HEADING_RE.exec(line);
    if (headingMatch) {
      currentSection = { heading: headingMatch[1].trim(), lines: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      overviewLines.push(line);
    }
  }

  return { overviewLines, sections };
}

export function findSectionLines(
  parsed: ParsedArticleSections,
  headingPattern: RegExp,
): string[] | null {
  for (const section of parsed.sections) {
    if (headingPattern.test(section.heading)) {
      return section.lines;
    }
  }
  return null;
}
