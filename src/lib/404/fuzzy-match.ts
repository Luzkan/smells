/** Levenshtein distance and fuzzy matching for "Did you mean?" suggestions. */

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] =
        a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

export interface FuzzyCandidate {
  slug: string;
  name: string;
}

interface FuzzyMatch {
  candidate: FuzzyCandidate;
  distance: number;
}

/**
 * Find the closest slug match for a given path.
 * Returns null if no match is within the distance threshold.
 */
export function findBestMatch(
  path: string,
  candidates: FuzzyCandidate[],
  thresholdFactor = 0.4,
  minThreshold = 3,
): FuzzyMatch | null {
  const threshold = Math.max(minThreshold, Math.floor(path.length * thresholdFactor));
  let bestMatch: FuzzyCandidate | null = null;
  let bestDist = Infinity;

  for (const candidate of candidates) {
    const dist = levenshtein(path, candidate.slug);
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = candidate;
    }
  }

  if (bestMatch && bestDist > 0 && bestDist <= threshold) {
    return { candidate: bestMatch, distance: bestDist };
  }

  return null;
}
