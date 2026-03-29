export const THEME_STORAGE_KEY = 'theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

// Keep these in sync with the light/dark --bg tokens in src/styles/global.css.
export const THEME_COLOR_LIGHT = '#FAF9F6';
export const THEME_COLOR_DARK = '#171412';

export type Theme = typeof DARK_THEME | typeof LIGHT_THEME;

export function getThemeColor(theme: string | null): string {
  return theme === DARK_THEME ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}
