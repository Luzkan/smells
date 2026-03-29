/**
 * Type-safe Object.fromEntries that preserves key→value literal types.
 *
 * Pass `as const` tuples and the return type maps each key to its exact value type.
 * Encapsulates the single unavoidable cast so consumers stay cast-free.
 */

export function typedFromEntries<const T extends readonly (readonly [string, unknown])[]>(
  entries: T,
): { [E in T[number] as E[0]]: E[1] } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return Object.fromEntries(entries) as any;
}
