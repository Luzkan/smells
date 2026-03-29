/**
 * Safely serialize JSON for inline <script type="application/json"> blocks.
 *
 * Escapes characters that can terminate the script tag or behave differently
 * across JS parsers while preserving JSON.parse() compatibility.
 */
function escapeScriptChar(char: string): string {
  switch (char) {
    case '<':
      return String.raw`\u003C`;
    case '>':
      return String.raw`\u003E`;
    case '&':
      return String.raw`\u0026`;
    case '\u2028':
      return String.raw`\u2028`;
    case '\u2029':
      return String.raw`\u2029`;
    default:
      return char;
  }
}

export function serializeJsonForScriptTag(value: unknown): string {
  return (JSON.stringify(value) ?? 'null').replaceAll(/[<>&\u2028\u2029]/g, escapeScriptChar);
}
