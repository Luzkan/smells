import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist/', 'node_modules/', 'planning/', '.astro/'],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    // Type-aware linting stays on TS/TSX only for now so Astro, JS config files,
    // and the service worker keep the current syntax-only path.
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Astro virtual modules (astro:content) can't be resolved by ESLint's
    // type checker, so .data accesses on CollectionEntry / getCollection
    // results appear as error-typed. Disable unsafe-* rules for these files.
    files: [
      'src/content.config.ts',
      'src/lib/catalog/build-catalog-data.ts',
      'src/lib/content/smell-utils.ts',
      'src/lib/content/prepare-article.ts',
      'src/pages/rss.xml.ts',
      'src/pages/site.webmanifest.ts',
      'tests/unit/lib/smell-utils.test.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  {
    files: ['**/*.astro', '**/*.astro/**'],
    rules: {
      'prefer-rest-params': 'off',
    },
  },
]);
