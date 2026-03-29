export function stripMarkdownFormatting(text: string): string {
  return text
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replaceAll(/\*\*([^*]+)\*\*/g, '$1')
    .replaceAll(/__([^_]+)__/g, '$1')
    .replaceAll(/\*([^*]+)\*/g, '$1')
    .replaceAll(/\b_([^_]+)_\b/g, '$1')
    .replaceAll(/`([^`]+)`/g, '$1');
}
