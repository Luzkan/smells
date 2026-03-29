/**
 * Pure builder functions for JSON-LD structured data.
 *
 * Each function returns a { "@context", "@graph" } object with @id-linked
 * entities. The Astro component (JsonLd.astro) is a thin wrapper that
 * serializes the return value into a single <script type="application/ld+json">.
 */
import {
  SITE_TITLE,
  siteDescription,
  SITE_URL,
  SCHEMA_IDS,
  AUTHOR_PERSON,
  type ObstructionCategory,
  type OccurrenceValue,
  type SmellHierarchyValue,
} from './constants';

// ---------------------------------------------------------------------------
// Types — projections of content data, not the full Zod schema
// ---------------------------------------------------------------------------

export type SmellListItem = {
  title: string;
  slug: string;
  description: string;
  alternateName?: string[];
};

export type ArticleEntry = {
  title: string;
  slug: string;
  lastUpdateDate: Date;
  obstruction: ObstructionCategory;
  occurrence: OccurrenceValue[];
  smellHierarchies: SmellHierarchyValue[];
  wordCount: number;
  knownAs?: string[];
};

// ---------------------------------------------------------------------------
// Catalog page: WebSite + CollectionPage + ItemList + DefinedTermSet
// ---------------------------------------------------------------------------

export function buildCatalogGraph(smells: SmellListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SCHEMA_IDS.website,
        name: SITE_TITLE,
        description: siteDescription(smells.length),
        url: SITE_URL,
        inLanguage: 'en',
        author: AUTHOR_PERSON,
      },
      {
        '@type': 'CollectionPage',
        '@id': SCHEMA_IDS.collection,
        name: SITE_TITLE,
        description: siteDescription(smells.length),
        url: SITE_URL,
        inLanguage: 'en',
        isPartOf: { '@id': SCHEMA_IDS.website },
        mainEntity: { '@id': SCHEMA_IDS.itemList },
      },
      {
        '@type': 'ItemList',
        '@id': SCHEMA_IDS.itemList,
        name: SITE_TITLE,
        numberOfItems: smells.length,
        itemListElement: smells.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.title,
          url: `${SITE_URL}/smells/${s.slug}`,
        })),
      },
      {
        '@type': 'DefinedTermSet',
        '@id': SCHEMA_IDS.glossary,
        name: SITE_TITLE,
        description: siteDescription(smells.length),
        url: SITE_URL,
        hasDefinedTerm: smells.map((s) => ({
          '@type': 'DefinedTerm' as const,
          name: s.title,
          description: s.description,
          url: `${SITE_URL}/smells/${s.slug}`,
          ...(s.alternateName?.length ? { alternateName: s.alternateName } : {}),
        })),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Article page: Article + BreadcrumbList
// ---------------------------------------------------------------------------

export function buildArticleGraph(entry: ArticleEntry, description: string) {
  const articleUrl = `${SITE_URL}/smells/${entry.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article' as const,
        headline: entry.title,
        description,
        url: articleUrl,
        dateModified: entry.lastUpdateDate.toISOString(),
        author: { '@id': SCHEMA_IDS.author },
        publisher: {
          '@type': 'Organization' as const,
          name: SITE_TITLE,
          url: SITE_URL,
        },
        isPartOf: { '@id': SCHEMA_IDS.website },
        mainEntityOfPage: { '@type': 'WebPage' as const, '@id': articleUrl },
        image: {
          '@type': 'ImageObject' as const,
          url: `${SITE_URL}/og/${entry.slug}.png`,
          width: 1200,
          height: 630,
        },
        inLanguage: 'en',
        wordCount: entry.wordCount,
        articleSection: entry.obstruction,
        keywords: [...entry.occurrence, ...entry.smellHierarchies].join(', '),
        about: {
          '@type': 'DefinedTerm' as const,
          name: entry.title,
          description,
          inDefinedTermSet: { '@id': SCHEMA_IDS.glossary },
          ...(entry.knownAs?.length ? { alternateName: entry.knownAs } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList' as const,
        itemListElement: [
          {
            '@type': 'ListItem' as const,
            position: 1,
            name: 'Catalog',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem' as const,
            position: 2,
            name: entry.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// About page: WebSite (reference) + AboutPage
// ---------------------------------------------------------------------------

export function buildAboutGraph(description: string, smellCount: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': SCHEMA_IDS.website,
        name: SITE_TITLE,
        url: SITE_URL,
      },
      {
        '@type': 'AboutPage',
        name: `About — ${SITE_TITLE}`,
        description,
        url: `${SITE_URL}/about`,
        inLanguage: 'en',
        isPartOf: { '@id': SCHEMA_IDS.website },
        mainEntity: { '@id': SCHEMA_IDS.author },
      },
      {
        ...AUTHOR_PERSON,
        description: `Senior Software Engineer and researcher. Author of the Code Smells Catalog — a structured reference of ${smellCount} code smells published through Springer Nature.`,
        alumniOf: {
          '@type': 'CollegeOrUniversity' as const,
          name: 'Wroclaw University of Science and Technology',
        },
      },
    ],
  };
}
