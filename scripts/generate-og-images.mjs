/**
 * generate-og-images.mjs — Generates Open Graph images for all pages.
 *
 * Produces:
 * - /public/og/default.png  (generic catalog OG image)
 * - /public/og/{slug}.png   (per-article OG image, one per smell)
 *
 * Uses Satori for SVG rendering and @resvg/resvg-js for SVG -> PNG conversion.
 * Fonts are vendored locally as TTF files for reliable clean builds.
 *
 * Usage: node scripts/generate-og-images.mjs
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = join(ROOT, 'content', 'smells');
const OUTPUT_DIR = join(ROOT, 'public', 'og');
const FONT_DIR = join(ROOT, 'scripts', 'fonts');

const BRAND_ACCENT_HEX = '#B45309';
const MUTED_HEX = '#8A8580';

// Keep these aligned with the light-mode tokens in src/styles/global.css.
const OBSTRUCTION_COLORS_HEX = {
  Bloaters: '#B45309',
  'Change Preventers': '#DC2626',
  Couplers: '#2451B3',
  'Data Dealers': '#0F766E',
  Dispensables: '#8A8580',
  'Functional Abusers': '#CA8A04',
  'Lexical Abusers': '#7B2FA8',
  Obfuscators: '#CA8A04',
  'Object Oriented Abusers': '#15803D',
  Other: '#8A8580',
};

// OG image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

function bufferToArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function loadVendoredFont(fileName) {
  const fontPath = join(FONT_DIR, fileName);

  if (!existsSync(fontPath)) {
    throw new Error(`Vendored OG font not found: ${fontPath}`);
  }

  return readFileSync(fontPath);
}

/** Load fonts needed for OG image generation */
function loadFonts() {
  const fraunces = loadVendoredFont('Fraunces-400.ttf');
  const plusJakarta = loadVendoredFont('PlusJakartaSans-600.ttf');

  return [
    { name: 'Fraunces', data: bufferToArrayBuffer(fraunces), weight: 400, style: 'normal' },
    {
      name: 'Plus Jakarta Sans',
      data: bufferToArrayBuffer(plusJakarta),
      weight: 600,
      style: 'normal',
    },
  ];
}

/** Convert Satori SVG string to PNG buffer via resvg */
async function svgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

/** Build the default (catalog-level) OG image JSX tree */
function buildDefaultImage() {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F0EB 100%)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        position: 'relative',
      },
      children: [
        // Top accent stripe
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #B45309, #DC2626, #2451B3, #7B2FA8, #15803D)',
            },
          },
        },
        // Site name
        {
          type: 'div',
          props: {
            style: {
              fontSize: '22px',
              fontWeight: 600,
              color: MUTED_HEX,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            },
            children: 'Code Smells Catalog',
          },
        },
        // Main title
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Fraunces, serif',
              fontSize: '72px',
              fontWeight: 400,
              color: '#1A1A1A',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              lineHeight: 1.15,
              maxWidth: '900px',
            },
            children: '56 Code Smells',
          },
        },
        // Subtitle
        {
          type: 'div',
          props: {
            style: {
              fontSize: '24px',
              color: '#6B6560',
              marginTop: '16px',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.5,
            },
            children: 'A comprehensive catalog — classified, connected, and browsable.',
          },
        },
        // Bottom branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: MUTED_HEX,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: BRAND_ACCENT_HEX,
                  },
                },
              },
              { type: 'span', props: { children: 'codesmells.org' } },
            ],
          },
        },
      ],
    },
  };
}

/** Build per-article OG image JSX tree */
function buildArticleImage(title, obstruction) {
  const categoryColor = OBSTRUCTION_COLORS_HEX[obstruction] ?? MUTED_HEX;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F0EB 100%)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        position: 'relative',
      },
      children: [
        // Top category color stripe
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: categoryColor,
            },
          },
        },
        // Left accent bar
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '6px',
              left: 0,
              width: '4px',
              bottom: 0,
              background: `linear-gradient(to bottom, ${categoryColor}, transparent)`,
            },
          },
        },
        // Site name badge
        {
          type: 'div',
          props: {
            style: {
              fontSize: '18px',
              fontWeight: 600,
              color: MUTED_HEX,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            },
            children: 'Code Smells Catalog',
          },
        },
        // Smell title
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Fraunces, serif',
              fontSize: title.length > 30 ? '56px' : '68px',
              fontWeight: 400,
              color: '#1A1A1A',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              maxWidth: '900px',
              marginBottom: '32px',
            },
            children: title,
          },
        },
        // Category badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '100px',
                    background: `${categoryColor}18`,
                    border: `1.5px solid ${categoryColor}40`,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: categoryColor,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: categoryColor,
                        },
                      },
                    },
                    { type: 'span', props: { children: obstruction } },
                  ],
                },
              },
            ],
          },
        },
        // Bottom branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '32px',
              left: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: MUTED_HEX,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: BRAND_ACCENT_HEX,
                  },
                },
              },
              { type: 'span', props: { children: 'codesmells.org' } },
            ],
          },
        },
      ],
    },
  };
}

/** Build the about page OG image JSX tree */
function buildAboutImage() {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F0EB 100%)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        position: 'relative',
      },
      children: [
        // Top accent stripe
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #B45309, #DC2626, #2451B3, #7B2FA8, #15803D)',
            },
          },
        },
        // Site name
        {
          type: 'div',
          props: {
            style: {
              fontSize: '22px',
              fontWeight: 600,
              color: MUTED_HEX,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            },
            children: 'Code Smells Catalog',
          },
        },
        // Main title
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Fraunces, serif',
              fontSize: '68px',
              fontWeight: 400,
              color: '#1A1A1A',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              lineHeight: 1.15,
              maxWidth: '900px',
            },
            children: 'About the Catalog',
          },
        },
        // Subtitle
        {
          type: 'div',
          props: {
            style: {
              fontSize: '24px',
              color: '#6B6560',
              marginTop: '16px',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.5,
            },
            children: '56 smells. 5 dimensions. Every relationship mapped.',
          },
        },
        // Springer badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '28px',
              padding: '8px 20px',
              borderRadius: '100px',
              background: `${BRAND_ACCENT_HEX}14`,
              border: `1.5px solid ${BRAND_ACCENT_HEX}30`,
              fontSize: '16px',
              fontWeight: 600,
              color: BRAND_ACCENT_HEX,
            },
            children: 'Published in Springer Nature',
          },
        },
        // Bottom branding
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: MUTED_HEX,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: BRAND_ACCENT_HEX,
                  },
                },
              },
              { type: 'span', props: { children: 'codesmells.org/about' } },
            ],
          },
        },
      ],
    },
  };
}

/** Parse all smell markdown files and return metadata */
function getAllSmells() {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const { data } = matter(raw);
    return {
      slug: data.slug,
      title: data.meta?.title ?? file.replace('.md', ''),
      obstruction: data.categories?.obstruction?.[0] ?? 'Other',
    };
  });
}

/** Main generation entry point */
async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Loading fonts...');
  const fonts = loadFonts();

  const smells = getAllSmells();
  console.log(`Generating OG images for ${smells.length} smells + default + about...`);

  // Generate default OG image
  const defaultSvg = await satori(buildDefaultImage(), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const defaultPng = await svgToPng(defaultSvg);
  await writeFile(join(OUTPUT_DIR, 'default.png'), defaultPng);
  console.log('  -> default.png');

  // Generate about page OG image
  const aboutSvg = await satori(buildAboutImage(), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const aboutPng = await svgToPng(aboutSvg);
  await writeFile(join(OUTPUT_DIR, 'about.png'), aboutPng);
  console.log('  -> about.png');

  // Generate per-article OG images
  for (const smell of smells) {
    const svg = await satori(buildArticleImage(smell.title, smell.obstruction), {
      width: WIDTH,
      height: HEIGHT,
      fonts,
    });
    const png = await svgToPng(svg);
    await writeFile(join(OUTPUT_DIR, `${smell.slug}.png`), png);
    console.log(`  -> ${smell.slug}.png`);
  }

  console.log(`Done. Generated ${smells.length + 2} OG images in public/og/`);
}

try {
  await main();
} catch (err) {
  console.error('OG image generation failed:', err);
  process.exit(1);
}
