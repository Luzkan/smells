/**
 * Shiki highlighter singleton + code example extraction pipeline.
 *
 * Build-time only — creates a single Shiki instance shared across all pages.
 * Handles: syntax highlighting, language display names, @@marker@@ annotations,
 * heading-aware caption extraction, and smelly-only block support.
 */
import { createHighlighter } from 'shiki';
import { stripMarkdownFormatting } from './strip-markdown';
import { escapeRegex } from '../string-utils';

// ---------------------------------------------------------------------------
// Language display names for the UtilityBar badge
// ---------------------------------------------------------------------------

const LANG_DISPLAY_NAMES: Record<string, string> = {
  py: 'Python',
  python: 'Python',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  java: 'Java',
  cs: 'C#',
  csharp: 'C#',
  rb: 'Ruby',
  ruby: 'Ruby',
  go: 'Go',
  cpp: 'C++',
  c: 'C',
  kt: 'Kotlin',
  kotlin: 'Kotlin',
  swift: 'Swift',
  rs: 'Rust',
  rust: 'Rust',
  php: 'PHP',
  hs: 'Haskell',
  haskell: 'Haskell',
};

export function getLangDisplayName(lang: string): string {
  return LANG_DISPLAY_NAMES[lang.toLowerCase()] ?? lang.toUpperCase();
}

// ---------------------------------------------------------------------------
// Shiki highlighter singleton
// ---------------------------------------------------------------------------

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'python',
        'typescript',
        'javascript',
        'java',
        'csharp',
        'ruby',
        'go',
        'cpp',
        'c',
        'kotlin',
        'swift',
        'rust',
        'php',
        'haskell',
        'text',
      ],
    }).catch((err) => {
      highlighterPromise = null; // allow retry on next call
      throw err;
    });
  }
  return highlighterPromise;
}

// ---------------------------------------------------------------------------
// @@marker@@ annotation engine
// ---------------------------------------------------------------------------

interface MarkerResult {
  cleanCode: string;
  markers: string[];
}

/**
 * Strip @@token@@ markers from code, returning clean code and unique tokens.
 * Markers are opt-in per article — code without @@ passes through unchanged.
 */
function stripMarkers(code: string): MarkerResult {
  const markerSet = new Set<string>();
  const cleanCode = code.replaceAll(/@@(.+?)@@/g, (_, token: string) => {
    markerSet.add(token);
    return token;
  });
  return { cleanCode, markers: [...markerSet] };
}

/**
 * Post-process Shiki HTML to wrap marker tokens in styled spans.
 * Uses a single-pass regex across all markers to avoid earlier replacements
 * creating HTML that later markers could match inside.
 */
function applyMarkers(html: string, markers: string[], cssClass: string): string {
  if (markers.length === 0) return html;

  const alternation = markers.map(escapeRegex).join('|');
  return html.replaceAll(
    new RegExp(`(>)([^<]*?)(${alternation})([^<]*?)(<)`, 'g'),
    (_, open, pre, tok, post, close) =>
      `${open}${pre}<span class="${cssClass}">${tok}</span>${post}${close}`,
  );
}

// ---------------------------------------------------------------------------
// Code rendering
// ---------------------------------------------------------------------------

interface RenderOptions {
  markers?: string[];
  markerClass?: string;
}

/**
 * Render a code string to Shiki HTML with dual themes (light + dark).
 * Adds line numbers and optionally wraps @@marker@@ tokens in styled spans.
 */
export async function renderCode(
  code: string,
  lang: string,
  options?: RenderOptions,
): Promise<string> {
  const hl = await getHighlighter();
  const validLang = lang || 'text';
  let html: string;
  try {
    html = hl.codeToHtml(code, {
      lang: validLang,
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          line(node, line) {
            node.children.unshift({
              type: 'element',
              tagName: 'span',
              properties: { class: 'line-number' },
              children: [{ type: 'text', value: String(line) }],
            });
          },
        },
      ],
    });
  } catch {
    html = hl.codeToHtml(code, {
      lang: 'text',
      themes: { light: 'github-light', dark: 'github-dark' },
    });
  }

  if (options?.markers?.length && options.markerClass) {
    html = applyMarkers(html, options.markers, options.markerClass);
  }

  return html;
}

// ---------------------------------------------------------------------------
// Code example extraction from markdown body
// ---------------------------------------------------------------------------

export interface CodeBlockData {
  code: string;
  lang: string;
  caption: string;
  markers: string[];
}

type CodeExampleData =
  | { kind: 'smelly-only'; smelly: CodeBlockData }
  | { kind: 'with-solution'; smelly: CodeBlockData; solution: CodeBlockData };

/**
 * Extract caption prose between a #### heading and the next code fence.
 * Returns undefined if no prose found between the heading and code.
 */
function extractCaption(block: string, headingPattern: RegExp): string {
  const regex = new RegExp(headingPattern.source + String.raw`[^\n]*\n`, 'i');
  const match = regex.exec(block);
  if (!match) return '';

  const afterHeading = block.slice(match.index + match[0].length);
  const nextBoundary = afterHeading.search(/```|####/);
  if (nextBoundary <= 0) return '';

  const prose = afterHeading.slice(0, nextBoundary).replaceAll(/\n+/g, ' ').trim();
  if (!prose || prose === '---') return '';

  return stripMarkdownFormatting(prose);
}

/**
 * Extract code example blocks from raw markdown body.
 *
 * Finds `<div class="example-block">` sections and extracts:
 * - Smelly and (optional) Solution code blocks with languages
 * - Per-tab captions from prose between #### headings and code fences
 * - @@marker@@ tokens for inline annotations
 *
 * Supports smelly-only blocks (single code fence, no Solution).
 */
export function extractCodeExamples(body: string): CodeExampleData[] {
  const exampleBlockRegex = /<div class="example-block">([\s\S]*?)<\/div>/g;

  return [...body.matchAll(exampleBlockRegex)]
    .map((blockMatch) => {
      const block = blockMatch[1];
      const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
      const codeBlocks = [...block.matchAll(codeRegex)].map((m) => {
        const { cleanCode, markers } = stripMarkers(m[2].trim());
        return { lang: m[1] || 'text', code: cleanCode, markers };
      });

      if (codeBlocks.length === 0) return null;

      const smellyCaption = extractCaption(block, /####\s+Smelly/);
      const solutionCaption = extractCaption(block, /####\s+Solution/);

      const smelly: CodeBlockData = {
        code: codeBlocks[0].code,
        lang: codeBlocks[0].lang,
        caption: smellyCaption,
        markers: codeBlocks[0].markers,
      };

      if (codeBlocks.length >= 2) {
        return {
          kind: 'with-solution' as const,
          smelly,
          solution: {
            code: codeBlocks[1].code,
            lang: codeBlocks[1].lang,
            caption: solutionCaption,
            markers: codeBlocks[1].markers,
          },
        };
      }

      return { kind: 'smelly-only' as const, smelly };
    })
    .filter((ex): ex is CodeExampleData => ex !== null);
}
