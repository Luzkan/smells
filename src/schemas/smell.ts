import { z } from 'zod';
import {
  EXPANSE_VALUES,
  HISTORY_ENTRY_TYPES,
  OBSTRUCTION_CATEGORIES,
  OCCURRENCE_VALUES,
  RELATION_TYPES,
  SMELL_HIERARCHY_VALUES,
  SOURCE_TYPES,
} from '../lib/constants';

/**
 * Filter transform that removes '---' null placeholders from YAML arrays.
 * Convention: `---` is used as a null/empty placeholder in the content frontmatter.
 */
const filterDashPlaceholders = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).transform((arr) => arr.filter((v) => v !== '---'));

function coerceToStringArray(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return [value];
  return value;
}

/**
 * Source href — deeply optional, accommodating books (ISBN), papers (journal),
 * courses/websites (direct_url), and cheatsheets.
 */
const hrefSchema = z
  .object({
    isbn_13: z.string().optional(),
    isbn_10: z.string().optional(),
    direct_url: z.string().optional(),
    journal: z.string().optional(),
    pages: z.string().optional(),
    publisher: z.string().optional(),
    year: z.coerce.number().optional(),
    volume: z.union([z.number(), z.string()]).optional(),
    number: z.union([z.number(), z.string()]).optional(),
  })
  .optional();

/**
 * Source — the bibliographic reference for a history entry.
 * Some files (e.g. oddball-solution.md, imperative-loops.md) place `named_as`
 * and/or `regarded_as` at the source level as well.
 */
const sourceSchema = z.object({
  year: z.coerce.number(),
  authors: z.array(z.string()),
  name: z.string(),
  type: z.enum(SOURCE_TYPES),
  href: hrefSchema,
  // Non-standard: some files have named_as/regarded_as at source level
  named_as: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => coerceToStringArray(v)),
  regarded_as: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => coerceToStringArray(v)),
});

/**
 * History entry — academic provenance tracking.
 * `type` is optional (fallacious-method-name.md has entries without it).
 * `regarded_as` is optional (some entries omit it).
 */
const historyEntrySchema = z.object({
  author: z.string(),
  type: z.enum(HISTORY_ENTRY_TYPES).optional(),
  named_as: z.array(z.string()).optional(),
  regarded_as: z.array(z.string()).optional(),
  source: sourceSchema,
});

/**
 * Related smell — a typed link to another smell entry.
 * `type` is an array of relationship strings: causes, caused, co-exist, family, antagonistic.
 */
const relatedSmellSchema = z.object({
  name: z.string(),
  slug: z.string(),
  type: z.array(z.enum(RELATION_TYPES)),
});

/**
 * Violation — principles and patterns that a smell violates.
 * Both arrays use `---` as null placeholder.
 */
const violationSchema = z.object({
  principles: filterDashPlaceholders(z.string()).default([]),
  patterns: filterDashPlaceholders(z.string()).default([]),
});

/**
 * Problems — general issues and principle/pattern violations.
 */
const problemsSchema = z.object({
  general: filterDashPlaceholders(z.string()).default([]),
  violation: violationSchema.default({ principles: [], patterns: [] }),
});

/**
 * Full Zod schema for a code smell content entry.
 *
 * Designed to be PERMISSIVE enough to handle all 56 content files
 * without modification. Key design decisions:
 *
 * - All string arrays apply the `---` filter transform
 * - `history[].type` uses `z.enum(HISTORY_ENTRY_TYPES).optional()` for known values
 * - `source.type` uses `z.enum(SOURCE_TYPES)` for known values: book, thesis, paper, course, cheatsheet
 * - `relations.related_smells[].type` uses `z.enum(RELATION_TYPES)` for known values
 * - `volume` and `number` accept both integers and strings
 * - `source.named_as` / `source.regarded_as` handle oddball files
 */
export const smellSchema = z.object({
  slug: z.string(),
  meta: z.object({
    last_update_date: z.coerce.date(),
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(), // TODO: add per-smell cover images and wire into OG/article hero
    known_as: filterDashPlaceholders(z.string()).default([]),
  }),
  categories: z.object({
    expanse: z.enum(EXPANSE_VALUES),
    obstruction: z.array(z.enum(OBSTRUCTION_CATEGORIES)).min(1),
    occurrence: z.array(z.enum(OCCURRENCE_VALUES)).min(1),
    smell_hierarchies: z.array(z.enum(SMELL_HIERARCHY_VALUES)),
    tags: filterDashPlaceholders(z.string()).default([]),
  }),
  relations: z
    .object({
      related_smells: z.array(relatedSmellSchema).default([]),
    })
    .optional()
    .default({ related_smells: [] }),
  problems: problemsSchema.default({}),
  refactors: filterDashPlaceholders(z.string()).default([]),
  history: z.array(historyEntrySchema).default([]),
});

export type SmellFrontmatter = z.infer<typeof smellSchema>;
