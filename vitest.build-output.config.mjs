import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/lib/build-output.test.ts'],
  },
});
