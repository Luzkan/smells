import type { SmellFilterData } from '../types';
import type { SmellFrontmatter } from '../../schemas/smell';
import type {
  ObstructionCategory,
  OccurrenceValue,
  SmellHierarchyValue,
  ExpanseValue,
} from '../constants';
import { typedFromEntries } from '../typed-from-entries';

interface DimensionConfig {
  key: Exclude<keyof SmellFrontmatter['categories'], 'tags'>;
  label: string;
  urlParam: string;
  /** Bare CSS custom property name, e.g. `--accent`. Wrap with `var()` at usage sites. */
  color: string;
  /** Bare CSS custom property name for the light variant, e.g. `--accent-light`. */
  lightColor: string;
}

/** Order determines rendering order in the FilterSidebar. */
export const DIMENSION_CONFIG = [
  {
    key: 'obstruction',
    label: 'Obstruction',
    urlParam: 'obstruction',
    color: '--accent',
    lightColor: '--accent-light',
  },
  {
    key: 'occurrence',
    label: 'Occurrence',
    urlParam: 'occurrence',
    color: '--blue',
    lightColor: '--blue-light',
  },
  {
    key: 'smell_hierarchies',
    label: 'Hierarchy',
    urlParam: 'hierarchy',
    color: '--purple',
    lightColor: '--purple-light',
  },
  {
    key: 'expanse',
    label: 'Expanse',
    urlParam: 'expanse',
    color: '--green',
    lightColor: '--green-light',
  },
] as const satisfies readonly DimensionConfig[];

export type DimensionKey = (typeof DIMENSION_CONFIG)[number]['key'];

/**
 * FilterState — maps each dimension key to the set of currently active filter values.
 * An empty Set means "no filter applied" for that dimension.
 */
export type FilterState = Record<DimensionKey, Set<string>>;

const DIMENSION_MAP: ReadonlyMap<DimensionKey, DimensionConfig> = new Map(
  DIMENSION_CONFIG.map((dim) => [dim.key, dim] as const),
);

/**
 * Exhaustive display label maps per dimension.
 * Every vocabulary value has a label — abbreviated where needed for compact chips,
 * identity-mapped otherwise. Total records: no fallbacks needed.
 */
const OBSTRUCTION_LABELS: Record<ObstructionCategory, string> = {
  Bloaters: 'Bloaters',
  'Change Preventers': 'Change Prev.',
  Couplers: 'Couplers',
  'Data Dealers': 'Data Dealers',
  Dispensables: 'Dispensables',
  'Functional Abusers': 'Func. Abusers',
  'Lexical Abusers': 'Lexical Ab.',
  Obfuscators: 'Obfuscators',
  'Object Oriented Abusers': 'OO Abusers',
  Other: 'Other',
};

const OCCURRENCE_LABELS: Record<OccurrenceValue, string> = {
  'Conditional Logic': 'Conditionals',
  Data: 'Data',
  Duplication: 'Duplication',
  Interfaces: 'Interfaces',
  'Measured Smells': 'Measured',
  'Message Calls': 'Messages',
  Names: 'Names',
  Responsibility: 'Responsibility',
  'Unnecessary Complexity': 'Complexity',
};

const HIERARCHY_LABELS: Record<SmellHierarchyValue, string> = {
  Antipattern: 'Antipattern',
  'Architecture Smell': 'Architecture',
  'Code Smell': 'Code Smell',
  'Design Smell': 'Design Smell',
  'Implementation Smell': 'Implementation',
  'Linguistic Antipattern': 'Ling. Antipattern',
  'Linguistic Smell': 'Ling. Smell',
};

const EXPANSE_LABELS: Record<ExpanseValue, string> = {
  Within: 'Within Class',
  Between: 'Between Classes',
};

const DIMENSION_LABEL_MAP: Record<DimensionKey, Record<string, string>> = {
  obstruction: OBSTRUCTION_LABELS,
  occurrence: OCCURRENCE_LABELS,
  smell_hierarchies: HIERARCHY_LABELS,
  expanse: EXPANSE_LABELS,
};

/**
 * Resolve a filter value to its display-friendly label.
 * Each dimension has a total label map — no fallbacks.
 */
export function getDisplayLabel(value: string, dimensionKey: DimensionKey): string {
  return DIMENSION_LABEL_MAP[dimensionKey][value];
}

/**
 * Lookup a dimension config by key.
 * Throws when an unknown key is provided to fail fast.
 */
export function getDimension(key: DimensionKey): DimensionConfig {
  const config = DIMENSION_MAP.get(key);
  if (!config) {
    throw new Error(`Unknown dimension: ${key}`);
  }
  return config;
}

const DIMENSION_KEY_SET: ReadonlySet<string> = new Set(DIMENSION_CONFIG.map((d) => d.key));

/**
 * Runtime guard for external string inputs (DOM attrs, URL params).
 */
export function isDimensionKey(key: string): key is DimensionKey {
  return DIMENSION_KEY_SET.has(key);
}

/**
 * Create a fresh FilterState with every dimension key mapped to an empty Set.
 * Returns a new object each call — safe from shared-reference mutation.
 */
export function createEmptyFilters(): FilterState {
  return typedFromEntries(DIMENSION_CONFIG.map((dim) => [dim.key, new Set<string>()] as const));
}

/**
 * CSS custom property pair for a dimension's accent colors.
 * Works in both Astro style attributes (object syntax) and Preact JSX.
 */
export function toCssVars(
  config: Pick<DimensionConfig, 'color' | 'lightColor'>,
): Record<string, string> {
  return { '--dim-color': `var(${config.color})`, '--dim-light': `var(${config.lightColor})` };
}

/**
 * Get the filter-relevant values for a given dimension from a smell.
 *
 * `expanse` is a single string in the frontmatter but we normalize it
 * to an array for uniform filter processing.
 */
export function getSmellDimensionValues(smell: SmellFilterData, key: DimensionKey): string[] {
  if (key === 'expanse') return [smell.categories.expanse];
  return smell.categories[key];
}
