import type { ObstructionCategory } from './constants';

/**
 * Obstruction category theming — single registry for all category-related lookups.
 *
 * Consolidates color, light color, and initial into one record per category,
 * preventing parallel maps from drifting out of sync.
 */

interface ObstructionTheme {
  color: string; // CSS variable for accent/border
  lightColor: string; // CSS variable for light backgrounds
  initial: string; // Single-letter avatar initial
}

const OBSTRUCTION_CONFIG = {
  Bloaters: { color: 'var(--accent)', lightColor: 'var(--accent-light)', initial: 'B' },
  'Change Preventers': { color: 'var(--red)', lightColor: 'var(--red-light)', initial: 'C' },
  Couplers: { color: 'var(--blue)', lightColor: 'var(--blue-light)', initial: 'C' },
  'Data Dealers': { color: 'var(--teal)', lightColor: 'var(--teal-light)', initial: 'D' },
  Dispensables: { color: 'var(--text-tertiary)', lightColor: 'var(--accent-light)', initial: 'D' },
  'Functional Abusers': { color: 'var(--yellow)', lightColor: 'var(--yellow-light)', initial: 'F' },
  'Lexical Abusers': { color: 'var(--purple)', lightColor: 'var(--purple-light)', initial: 'L' },
  Obfuscators: { color: 'var(--yellow)', lightColor: 'var(--yellow-light)', initial: 'O' },
  'Object Oriented Abusers': {
    color: 'var(--green)',
    lightColor: 'var(--green-light)',
    initial: 'O',
  },
  Other: { color: 'var(--text-tertiary)', lightColor: 'var(--accent-light)', initial: '?' },
} satisfies Record<ObstructionCategory, ObstructionTheme>;

export function getObstructionTheme(name: ObstructionCategory): ObstructionTheme {
  return OBSTRUCTION_CONFIG[name];
}
