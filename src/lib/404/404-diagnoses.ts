export interface Diagnosis {
  smell: string;
  slug: string;
  text: string;
}

export const DIAGNOSES: Diagnosis[] = [
  {
    smell: 'Dead Code',
    slug: 'dead-code',
    text: 'Unreachable content that clutters the sitemap and confuses visitors about what exists.',
  },
  {
    smell: 'Speculative Generality',
    slug: 'speculative-generality',
    text: 'Someone assumed this URL would be useful someday. That day never came.',
  },
  {
    smell: 'Lazy Element',
    slug: 'lazy-element',
    text: "This page doesn't do enough to justify its existence \u2014 too empty to earn its keep.",
  },
  {
    smell: 'Feature Envy',
    slug: 'feature-envy',
    text: 'This URL desperately wants to be a page that exists somewhere else.',
  },
  {
    smell: 'Shotgun Surgery',
    slug: 'shotgun-surgery',
    text: 'A single URL migration required changes across 56 pages. Looks like we missed one.',
  },
  {
    smell: 'Middle Man',
    slug: 'middle-man',
    text: 'You asked the server for a page and it just shrugged and forwarded you here.',
  },
  {
    smell: 'Message Chain',
    slug: 'message-chain',
    text: 'Link \u2192 redirect \u2192 redirect \u2192 404. A classic coupling anti-pattern.',
  },
  {
    smell: 'Refused Bequest',
    slug: 'refused-bequest',
    text: 'This route inherited a URL from the old site and ignored everything useful about it.',
  },
  {
    smell: 'Long Parameter List',
    slug: 'long-parameter-list',
    text: 'If the URL you typed had this many segments, maybe that was the first red flag.',
  },
  {
    smell: 'Primitive Obsession',
    slug: 'primitive-obsession',
    text: 'Using a raw string URL when you should have used a type-safe route. Classic.',
  },
  {
    smell: 'Callback Hell',
    slug: 'callback-hell',
    text: 'You followed a link, which followed a link, which followed a link\u2026 and ended up here.',
  },
  {
    smell: 'Large Class',
    slug: 'large-class',
    text: 'This 404 page now handles all errors. It knows too much and does too little.',
  },
];
