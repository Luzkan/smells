import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, siteDescription, SITE_URL } from '../lib/constants';
import { resolveSmellDescription } from '../lib/content/extract-description';
import { getBody, sortSmellsByTitle } from '../lib/content/smell-utils';
import type { APIContext } from 'astro';

const RSS_DESCRIPTION_MAX_LENGTH = 250;

export async function GET(context: APIContext) {
  const smells = await getCollection('smells');

  // Sort alphabetically by title for consistent ordering
  const sorted = sortSmellsByTitle(smells);

  return rss({
    title: SITE_TITLE,
    description: siteDescription(sorted.length),
    site: context.site?.origin ?? SITE_URL,
    items: sorted.map((smell) => ({
      title: smell.data.meta.title,
      link: `/smells/${smell.data.slug}`,
      description: resolveSmellDescription(
        smell.data.meta.description,
        getBody(smell),
        RSS_DESCRIPTION_MAX_LENGTH,
        smell.data.slug,
      ),
      pubDate: smell.data.meta.last_update_date,
    })),
  });
}
