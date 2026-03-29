import { getCollection } from 'astro:content';
import { SITE_TITLE, siteDescription } from '../lib/constants';
import type { APIContext } from 'astro';

export async function GET(_context: APIContext) {
  const smells = await getCollection('smells');

  const manifest = {
    name: SITE_TITLE,
    short_name: 'Code Smells',
    lang: 'en',
    description: siteDescription(smells.length),
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#B45309',
    background_color: '#FAF9F6',
    display: 'standalone',
    start_url: '/',
    scope: '/',
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
