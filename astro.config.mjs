import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkSmellLinks from './src/plugins/remark-smell-links';
import remarkOverviewHeading from './src/plugins/remark-overview-heading';
import remarkStripSections from './src/plugins/remark-strip-sections';
import remarkCalloutSections from './src/plugins/remark-callout-sections';

export default defineConfig({
  site: 'https://codesmells.org', // also defined in: src/lib/constants.ts
  output: 'static',
  trailingSlash: 'never',
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Ordering is load-bearing:
    // 1) rewrite ./slug.md links while headings still original,
    // 2) normalize first H2 to "Overview",
    // 3) strip sections rendered by Astro components,
    // 4) wrap remaining callout sections.
    // Moving callout before strip can wrap sections that are meant to be removed.
    remarkPlugins: [
      remarkSmellLinks,
      remarkOverviewHeading,
      remarkStripSections,
      remarkCalloutSections,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
