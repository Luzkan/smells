import { describe, it, expect, beforeAll } from 'vitest';
import {
  buildCatalogGraph,
  buildArticleGraph,
  buildAboutGraph,
  type SmellListItem,
  type ArticleEntry,
} from '../../../src/lib/json-ld';
import { AUTHOR_PROFILE_URL, SCHEMA_IDS, SITE_URL } from '../../../src/lib/constants';

type GraphEntity = Record<string, unknown>;

function assertDefined<T>(val: T | undefined | null, msg?: string): asserts val is T {
  if (val == null) throw new Error(msg ?? 'Expected value to be defined');
}

function findByType(graph: { '@graph': GraphEntity[] }, typeName: string): GraphEntity {
  const entity = graph['@graph'].find((e) => e['@type'] === typeName);
  assertDefined(entity, `Expected @type ${typeName} in @graph`);
  return entity;
}

function makeSmells(count = 3): SmellListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    title: `Smell ${i + 1}`,
    slug: `smell-${i + 1}`,
    description: `Description for smell ${i + 1}.`,
    ...(i === 0 ? { alternateName: ['Alias A', 'Alias B'] } : {}),
  }));
}

function makeArticleEntry(overrides: Partial<ArticleEntry> = {}): ArticleEntry {
  return {
    title: 'Dead Code',
    slug: 'dead-code',
    lastUpdateDate: new Date('2022-04-19'),
    obstruction: 'Dispensables',
    occurrence: ['Unnecessary Complexity'],
    smellHierarchies: ['Code Smell', 'Implementation Smell'],
    wordCount: 450,
    knownAs: ['Unreachable Code'],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Catalog graph
// ---------------------------------------------------------------------------

describe('buildCatalogGraph', () => {
  const smells = makeSmells(3);
  const result = buildCatalogGraph(smells);

  it('has single @context at root', () => {
    expect(result['@context']).toBe('https://schema.org');
  });

  it('contains exactly 4 entities in @graph', () => {
    expect(result['@graph']).toHaveLength(4);
  });

  it('has no @context on individual entities', () => {
    for (const entity of result['@graph']) {
      expect(entity).not.toHaveProperty('@context');
    }
  });

  it('includes WebSite with @id and author', () => {
    const ws = findByType(result, 'WebSite');
    expect(ws['@id']).toBe(SCHEMA_IDS.website);
    expect(ws.author).toBeDefined();
    const author = ws.author as GraphEntity;
    const sameAs = author.sameAs as string[];
    expect(author['@id']).toBe(SCHEMA_IDS.author);
    expect(author.url).toBe(AUTHOR_PROFILE_URL);
    expect(sameAs).toBeInstanceOf(Array);
    expect(sameAs).toContain(AUTHOR_PROFILE_URL);
    expect(sameAs).toContain('https://luzkan.com');
    expect(ws.inLanguage).toBe('en');
  });

  it('includes CollectionPage linked to ItemList', () => {
    const cp = findByType(result, 'CollectionPage');
    expect(cp['@id']).toBe(SCHEMA_IDS.collection);
    expect((cp.mainEntity as GraphEntity)['@id']).toBe(SCHEMA_IDS.itemList);
    expect((cp.isPartOf as GraphEntity)['@id']).toBe(SCHEMA_IDS.website);
  });

  it('includes ItemList with lean ListItems (no description)', () => {
    const il = findByType(result, 'ItemList');
    expect(il['@id']).toBe(SCHEMA_IDS.itemList);
    expect(il.numberOfItems).toBe(3);
    const items = il.itemListElement as GraphEntity[];
    expect(items).toHaveLength(3);

    const first = items[0];
    expect(first.position).toBe(1);
    expect(first.name).toBe('Smell 1');
    expect(first.url).toBe(`${SITE_URL}/smells/smell-1`);
    expect(first).not.toHaveProperty('description');
  });

  it('includes DefinedTermSet with descriptions and alternateName', () => {
    const dts = findByType(result, 'DefinedTermSet');
    expect(dts['@id']).toBe(SCHEMA_IDS.glossary);
    const terms = dts.hasDefinedTerm as GraphEntity[];
    expect(terms).toHaveLength(3);

    const firstTerm = terms[0];
    expect(firstTerm['@type']).toBe('DefinedTerm');
    expect(firstTerm.name).toBe('Smell 1');
    expect(firstTerm.description).toBe('Description for smell 1.');
    expect(firstTerm.url).toBe(`${SITE_URL}/smells/smell-1`);
    expect(firstTerm.alternateName).toEqual(['Alias A', 'Alias B']);

    const secondTerm = terms[1];
    expect(secondTerm).not.toHaveProperty('alternateName');
  });
});

// ---------------------------------------------------------------------------
// Article graph
// ---------------------------------------------------------------------------

describe('buildArticleGraph', () => {
  const entry = makeArticleEntry();
  const description = 'Unreachable or unused code that clutters the codebase.';
  const result = buildArticleGraph(entry, description);

  it('has single @context at root', () => {
    expect(result['@context']).toBe('https://schema.org');
  });

  it('contains exactly 2 entities in @graph', () => {
    expect(result['@graph']).toHaveLength(2);
  });

  it('has no @context on individual entities', () => {
    for (const entity of result['@graph']) {
      expect(entity).not.toHaveProperty('@context');
    }
  });

  describe('Article entity', () => {
    const article = findByType(buildArticleGraph(entry, description), 'Article');

    it('has headline and description', () => {
      expect(article.headline).toBe('Dead Code');
      expect(article.description).toBe(description);
    });

    it('has dateModified but no datePublished', () => {
      expect(article.dateModified).toBe('2022-04-19T00:00:00.000Z');
      expect(article).not.toHaveProperty('datePublished');
    });

    it('references author by @id (not inline)', () => {
      expect(article.author).toEqual({ '@id': SCHEMA_IDS.author });
    });

    it('references website by @id', () => {
      expect(article.isPartOf).toEqual({ '@id': SCHEMA_IDS.website });
    });

    it('has mainEntityOfPage with article URL', () => {
      const mep = article.mainEntityOfPage as GraphEntity;
      expect(mep['@type']).toBe('WebPage');
      expect(mep['@id']).toBe(`${SITE_URL}/smells/dead-code`);
    });

    it('has image as ImageObject with dimensions', () => {
      const img = article.image as GraphEntity;
      expect(img['@type']).toBe('ImageObject');
      expect(img.url).toBe(`${SITE_URL}/og/dead-code.png`);
      expect(img.width).toBe(1200);
      expect(img.height).toBe(630);
    });

    it('has inLanguage, wordCount, articleSection', () => {
      expect(article.inLanguage).toBe('en');
      expect(article.wordCount).toBe(450);
      expect(article.articleSection).toBe('Dispensables');
    });

    it('has keywords from occurrence + hierarchies', () => {
      expect(article.keywords).toBe('Unnecessary Complexity, Code Smell, Implementation Smell');
    });

    it('has about.DefinedTerm with inDefinedTermSet reference', () => {
      const about = article.about as GraphEntity;
      expect(about['@type']).toBe('DefinedTerm');
      expect(about.name).toBe('Dead Code');
      expect(about.description).toBe(description);
      expect((about.inDefinedTermSet as GraphEntity)['@id']).toBe(SCHEMA_IDS.glossary);
      expect(about.alternateName).toEqual(['Unreachable Code']);
    });

    it('has empty keywords when occurrence + hierarchies are empty', () => {
      const noKeywords = makeArticleEntry({ occurrence: [], smellHierarchies: [] });
      const graph = buildArticleGraph(noKeywords, description);
      const art = findByType(graph, 'Article');
      expect(art.keywords).toBe('');
    });

    it('omits alternateName on about when knownAs is empty', () => {
      const noAliases = makeArticleEntry({ knownAs: undefined });
      const graph = buildArticleGraph(noAliases, description);
      const art = findByType(graph, 'Article');
      expect(art.about).not.toHaveProperty('alternateName');
    });
  });

  describe('BreadcrumbList entity', () => {
    const breadcrumb = findByType(result, 'BreadcrumbList');

    it('has exactly 2 levels', () => {
      const items = breadcrumb.itemListElement as GraphEntity[];
      expect(items).toHaveLength(2);
    });

    it('first item is Catalog with URL', () => {
      const items = breadcrumb.itemListElement as GraphEntity[];
      const first = items[0];
      expect(first.position).toBe(1);
      expect(first.name).toBe('Catalog');
      expect(first.item).toBe(SITE_URL);
    });

    it('second item is the smell title with the current page URL', () => {
      const items = breadcrumb.itemListElement as GraphEntity[];
      const second = items[1];
      expect(second.position).toBe(2);
      expect(second.name).toBe('Dead Code');
      expect(second.item).toBe(`${SITE_URL}/smells/dead-code`);
    });
  });
});

// ---------------------------------------------------------------------------
// About graph
// ---------------------------------------------------------------------------

describe('buildAboutGraph', () => {
  it('contains exactly 3 entities', () => {
    const result = buildAboutGraph('About description', 56);
    expect(result['@graph']).toHaveLength(3);
  });

  it('has single @context at root', () => {
    const result = buildAboutGraph('About description', 56);
    expect(result['@context']).toBe('https://schema.org');
  });

  it('includes WebSite reference with @id', () => {
    const result = buildAboutGraph('About description', 56);
    const ws = findByType(result, 'WebSite');
    expect(ws['@id']).toBe(SCHEMA_IDS.website);
  });

  it('includes AboutPage linked to WebSite and author', () => {
    const result = buildAboutGraph('Custom description', 56);
    const ap = findByType(result, 'AboutPage');
    expect(ap.description).toBe('Custom description');
    expect(ap.url).toBe(`${SITE_URL}/about`);
    expect((ap.isPartOf as GraphEntity)['@id']).toBe(SCHEMA_IDS.website);
    expect((ap.mainEntity as GraphEntity)['@id']).toBe(SCHEMA_IDS.author);
    expect(ap.inLanguage).toBe('en');
  });

  it('uses provided description', () => {
    const result = buildAboutGraph('About the Code Smells Catalog', 56);
    const ap = findByType(result, 'AboutPage');
    expect(ap.description).toBe('About the Code Smells Catalog');
  });

  it('includes the author as a top-level Person entity', () => {
    const result = buildAboutGraph('About description', 56);
    const person = findByType(result, 'Person');
    const sameAs = person.sameAs as string[];
    const alumniOf = person.alumniOf as GraphEntity;

    expect(person['@id']).toBe(SCHEMA_IDS.author);
    expect(person.url).toBe(AUTHOR_PROFILE_URL);
    expect(sameAs).toContain(AUTHOR_PROFILE_URL);
    expect(sameAs).toContain('https://luzkan.com');
    expect(person.description).toContain('Code Smells Catalog');
    expect(alumniOf['@type']).toBe('CollegeOrUniversity');
    expect(alumniOf.name).toBe('Wroclaw University of Science and Technology');
  });
});

// ---------------------------------------------------------------------------
// deriveMetaDescription (shared util)
// ---------------------------------------------------------------------------

describe('deriveMetaDescription', () => {
  // Imported separately to test in isolation
  let deriveMetaDescription: typeof import('../../../src/lib/content/extract-description').deriveMetaDescription;
  let resolveSmellDescription: typeof import('../../../src/lib/content/extract-description').resolveSmellDescription;

  beforeAll(async () => {
    const mod = await import('../../../src/lib/content/extract-description');
    deriveMetaDescription = mod.deriveMetaDescription;
    resolveSmellDescription = mod.resolveSmellDescription;
  });

  it('extracts first paragraph, skipping headings', () => {
    const body = '## Title\n\nThis is the first paragraph.';
    expect(deriveMetaDescription(body)).toBe('This is the first paragraph.');
  });

  it('strips markdown formatting', () => {
    const body = '**Bold** and *italic* with [link](url) and `code`.';
    expect(deriveMetaDescription(body)).toBe('Bold and italic with link and code.');
  });

  it('truncates at word boundary with default maxLength', () => {
    const body = 'A '.repeat(100); // 200 chars
    const result = deriveMetaDescription(body);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toMatch(/\.\.\.$/);
  });

  it('respects custom maxLength', () => {
    const body = 'A '.repeat(100);
    const result = deriveMetaDescription(body, 120);
    expect(result.length).toBeLessThanOrEqual(120);
    expect(result).toMatch(/\.\.\.$/);
  });

  it('returns empty string for empty body', () => {
    expect(deriveMetaDescription('')).toBe('');
  });

  it('skips image lines and front-matter fences', () => {
    const body = '---\n![image](url)\n[link-only](url)\nActual content.';
    expect(deriveMetaDescription(body)).toBe('Actual content.');
  });

  it('prefers authored description when provided', () => {
    const body = '## Title\n\nFallback body description.';
    expect(resolveSmellDescription('Authored summary.', body)).toBe('Authored summary.');
  });

  it('falls back to derived overview when authored description is missing', () => {
    const body = '## Title\n\nFallback body description.';
    expect(resolveSmellDescription(undefined, body)).toBe('Fallback body description.');
  });

  it('can recover authored copy directly from the markdown frontmatter by slug', () => {
    const body = '## Title\n\nFallback body description.';
    expect(resolveSmellDescription(undefined, body, 200, 'boolean-blindness')).toBe(
      "Does filter(true) mean take or drop? When a function operates on raw booleans, it destroys the information about what those values represent. The type system knows; the reader doesn't.",
    );
  });

  it('truncates authored descriptions at word boundaries', () => {
    const authored = 'A '.repeat(100);
    const result = resolveSmellDescription(authored, 'Ignored body', 120);
    expect(result.length).toBeLessThanOrEqual(120);
    expect(result).toMatch(/\.\.\.$/);
  });
});
