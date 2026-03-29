import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { smellSchema } from './schemas/smell';

const smells = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/smells' }),
  schema: smellSchema,
});

export const collections = { smells };
