export const SITE_TITLE = 'Code Smells Catalog';
export const siteDescription = (count: number) =>
  `A comprehensive catalog of ${count} code smells — structured, browsable reference for developers and researchers.`;

export const SITE_URL = 'https://codesmells.org';
export const TWITTER_HANDLE = '@luzkanz';
export const AUTHOR_PROFILE_URL = 'https://www.linkedin.com/in/luzkan/';
export const GITHUB_PROFILE_URL = 'https://github.com/luzkan';
export const PERSONAL_WEBSITE_URL = 'https://luzkan.com';

export const SPRINGER_DOI = '10.1007/978-3-031-25695-0_24';
export const SPRINGER_PAPER_URL = `https://link.springer.com/chapter/${SPRINGER_DOI}`;
export const THESIS_URL = 'https://github.com/Luzkan/smells/blob/main/docs/thesis.pdf';

// Add new values here when content introduces new vocabulary.
export const RELATION_TYPES = ['causes', 'caused', 'co-exist', 'family', 'antagonistic'] as const;
export type RelationType = (typeof RELATION_TYPES)[number];

// Add new values here when content introduces new vocabulary.
export const HISTORY_ENTRY_TYPES = ['origin', 'parentage', 'mention', 'update'] as const;

// Add new values here when content introduces new vocabulary.
export const SOURCE_TYPES = ['book', 'thesis', 'paper', 'course', 'cheatsheet'] as const;

// Category dimension vocabularies (closed set — research data).
export const OBSTRUCTION_CATEGORIES = [
  'Bloaters',
  'Change Preventers',
  'Couplers',
  'Data Dealers',
  'Dispensables',
  'Functional Abusers',
  'Lexical Abusers',
  'Obfuscators',
  'Object Oriented Abusers',
  'Other',
] as const;
export type ObstructionCategory = (typeof OBSTRUCTION_CATEGORIES)[number];

export const OCCURRENCE_VALUES = [
  'Conditional Logic',
  'Data',
  'Duplication',
  'Interfaces',
  'Measured Smells',
  'Message Calls',
  'Names',
  'Responsibility',
  'Unnecessary Complexity',
] as const;
export type OccurrenceValue = (typeof OCCURRENCE_VALUES)[number];

export const SMELL_HIERARCHY_VALUES = [
  'Antipattern',
  'Architecture Smell',
  'Code Smell',
  'Design Smell',
  'Implementation Smell',
  'Linguistic Antipattern',
  'Linguistic Smell',
] as const;
export type SmellHierarchyValue = (typeof SMELL_HIERARCHY_VALUES)[number];

export const EXPANSE_VALUES = ['Within', 'Between'] as const;
export type ExpanseValue = (typeof EXPANSE_VALUES)[number];

export const RELATION_TYPE_LABELS: Record<RelationType, { label: string; color: string }> = {
  causes: { label: 'Causes', color: 'var(--red)' },
  caused: { label: 'Caused by', color: 'var(--accent)' },
  'co-exist': { label: 'Co-exists', color: 'var(--blue)' },
  family: { label: 'Family', color: 'var(--purple)' },
  antagonistic: { label: 'Antagonistic', color: 'var(--teal)' },
};

export const SCHEMA_IDS = {
  website: `${SITE_URL}/#website`,
  author: `${SITE_URL}/#author`,
  collection: `${SITE_URL}/#collection`,
  itemList: `${SITE_URL}/#item-list`,
  glossary: `${SITE_URL}/#glossary`,
} as const;

export const CITATION = {
  apaText:
    'Jerzyk, M., Madeyski, L. (2023). Code Smells: A Comprehensive Online Catalog and Taxonomy. In: Studies in Systems, Decision and Control, vol 462. Springer, Cham. https://doi.org/10.1007/978-3-031-25695-0_24',
  apaHtml:
    '<strong>Jerzyk, M.</strong>, Madeyski, L. (2023). Code Smells: A Comprehensive Online Catalog and Taxonomy. In: <em>Studies in Systems, Decision and Control, vol 462.</em> Springer, Cham.',
  bibtex:
    '@incollection{jerzyk2023codesmells,\n  author    = {Jerzyk, Marcel and Madeyski, Lech},\n  title     = {Code Smells: A Comprehensive Online Catalog and Taxonomy},\n  booktitle = {Developments in Information and Knowledge Management Systems for Business Applications},\n  series    = {Studies in Systems, Decision and Control},\n  volume    = {462},\n  publisher = {Springer, Cham},\n  year      = {2023},\n  doi       = {10.1007/978-3-031-25695-0_24}\n}',
} as const;

export const OPEN_MOBILE_SEARCH_EVENT = 'open-mobile-search';

export const GITHUB_REPO = 'luzkan/smells';
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const ACADEMIC_CITATIONS_FALLBACK = 25;

export const AUTHOR_PERSON = {
  '@type': 'Person' as const,
  '@id': SCHEMA_IDS.author,
  name: 'Marcel Jerzyk',
  jobTitle: 'Senior Software Engineer',
  url: AUTHOR_PROFILE_URL,
  image: `${SITE_URL}/images/marcel-jerzyk.png`,
  sameAs: [
    AUTHOR_PROFILE_URL,
    GITHUB_PROFILE_URL,
    PERSONAL_WEBSITE_URL,
    'https://x.com/luzkanz',
    'https://link.springer.com/chapter/10.1007/978-3-031-53227-6_12',
  ],
};
