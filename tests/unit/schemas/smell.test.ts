import { describe, it, expect } from 'vitest';
import { smellSchema } from '../../../src/schemas/smell';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve('content/smells');

function parseValidatedSmell(file: string) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
  const result = smellSchema.safeParse(matter(raw).data);
  if (!result.success) {
    console.error(`Schema errors in ${file}:`, result.error.format());
    return null;
  }
  return result.data;
}

describe('Smell schema validation', () => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  it('should have content files', () => {
    expect(files.length).toBeGreaterThanOrEqual(56);
  });

  for (const file of files) {
    it(`validates ${file}`, () => {
      expect(parseValidatedSmell(file)).not.toBeNull();
    });
  }

  // Cross-reference: every relations slug must resolve to an actual file
  it('all relation slugs resolve to existing files', () => {
    const slugs = new Set(files.map((f) => f.replace('.md', '')));
    const brokenRefs: string[] = [];

    for (const file of files) {
      const smell = parseValidatedSmell(file);
      if (!smell) {
        brokenRefs.push(`${file}: failed schema validation before relation checks`);
        continue;
      }

      const relations = smell.relations.related_smells;
      for (const rel of relations) {
        if (rel.slug && rel.slug !== '---' && !slugs.has(rel.slug)) {
          brokenRefs.push(`${file}: references non-existent slug "${rel.slug}"`);
        }
      }
    }

    if (brokenRefs.length > 0) {
      console.warn('Broken references (known bugs):', brokenRefs);
    }
    expect(brokenRefs).toHaveLength(0);
  });

  // Slug matches filename
  it('all slugs match their filenames', () => {
    const mismatches: string[] = [];
    for (const file of files) {
      const smell = parseValidatedSmell(file);
      const expectedSlug = file.replace('.md', '');
      if (!smell) {
        mismatches.push(`${file}: failed schema validation before slug check`);
        continue;
      }
      if (smell.slug !== expectedSlug) {
        mismatches.push(`${file}: slug "${smell.slug}" !== filename "${expectedSlug}"`);
      }
    }
    expect(mismatches).toHaveLength(0);
  });
});
