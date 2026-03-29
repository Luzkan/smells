import { test, expect, type Page, type Locator } from '@playwright/test';
import { THEME_COLOR_DARK } from '../../src/lib/theme-contract';

const DARK_THEME_RGB = 'rgb(23, 20, 18)';
const DARK_NAV_RGBA = 'rgba(23, 20, 18, 0.85)';
const DARK_SEARCH_INPUT_RGB = 'rgb(43, 37, 32)';

async function readTheme(page: Page) {
  return page.evaluate(() => document.documentElement.dataset.theme ?? null);
}

async function readActiveThemeColor(page: Page) {
  return page.evaluate(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    return {
      content: meta?.getAttribute('content'),
      isManaged: meta instanceof HTMLElement && meta.dataset.themeColor === 'managed',
    };
  });
}

async function readThemePresentation(page: Page) {
  return page.evaluate(() => {
    const html = document.documentElement;
    const bodyStyles = getComputedStyle(document.body);

    return {
      inlineBackground: html.style.backgroundColor,
      inlineColorScheme: html.style.colorScheme,
      initialTransitions: html.dataset.initialTransitions ?? null,
      themeTransitions: html.dataset.themeTransitions ?? null,
      bodyBackground: bodyStyles.backgroundColor,
      bodyTransitionDuration: bodyStyles.transitionDuration,
      navBackground: getComputedStyle(document.querySelector('.nav')!).backgroundColor,
      searchInputBackground: getComputedStyle(
        document.querySelector('.filter-sidebar__search-input')!,
      ).backgroundColor,
    };
  });
}

async function clickThemeToggle(page: Page) {
  await page.locator('.nav .theme-toggle').click({ force: true });
}

async function clickStable(locator: Locator): Promise<void> {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'nearest' }));
  await expect(locator).toBeVisible();
  try {
    await locator.click({ timeout: 3000 });
  } catch {
    await locator.click({ force: true });
  }
}

test.describe('Theme Toggle', () => {
  test('toggle changes data-theme attribute', async ({ page }) => {
    await page.goto('/');

    // Get the initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    expect(initialTheme).toBeTruthy();

    // Click the theme toggle button
    await clickThemeToggle(page);

    // Verify the theme changed
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
    expect(['light', 'dark']).toContain(newTheme);

    // Click again to toggle back
    await clickThemeToggle(page);
    const restoredTheme = await page.locator('html').getAttribute('data-theme');
    expect(restoredTheme).toBe(initialTheme);
  });

  test('persists theme choice to localStorage', async ({ page }) => {
    await page.goto('/');

    // Toggle to the opposite theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    await clickThemeToggle(page);

    const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';

    // Check localStorage was updated
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe(expectedTheme);

    // Reload and verify the theme persists
    await page.reload();
    const themeAfterReload = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterReload).toBe(expectedTheme);
  });

  test('respects system preference on first visit', async ({ page }) => {
    // Clear any existing theme preference
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme'));

    // Emulate dark mode preference and reload
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();

    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('respects light system preference on first visit', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme'));

    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();

    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('light');
  });

  test('toggle button has accessible aria-label', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('.nav .theme-toggle');
    const ariaLabel = await button.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('mode');
  });

  test('saved theme overrides system preference for theme-color after reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    expect(await readTheme(page)).toBe('light');

    await clickThemeToggle(page);
    await expect.poll(() => readTheme(page)).toBe('dark');

    const toggledThemeColor = await readActiveThemeColor(page);
    expect(toggledThemeColor.isManaged).toBe(true);
    expect(toggledThemeColor.content).toBe(THEME_COLOR_DARK);

    await page.reload();

    expect(await readTheme(page)).toBe('dark');

    const reloadedThemeColor = await readActiveThemeColor(page);
    expect(reloadedThemeColor.isManaged).toBe(true);
    expect(reloadedThemeColor.content).toBe(THEME_COLOR_DARK);
  });

  test('saved dark theme reload primes a dark canvas before transitions are armed', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));

    await page.reload();
    await expect.poll(() => readTheme(page)).toBe('dark');

    const reloadedPresentation = await readThemePresentation(page);
    expect(reloadedPresentation.inlineBackground).toBe(DARK_THEME_RGB);
    expect(reloadedPresentation.inlineColorScheme).toBe('dark');
    expect(reloadedPresentation.initialTransitions).toBeNull();
    expect(reloadedPresentation.themeTransitions).toBeNull();
    expect(reloadedPresentation.bodyBackground).toBe(DARK_THEME_RGB);
    expect(parseFloat(reloadedPresentation.bodyTransitionDuration)).toBeLessThanOrEqual(0.01);
    expect(reloadedPresentation.navBackground).toBe(DARK_NAV_RGBA);
    expect(reloadedPresentation.searchInputBackground).toBe(DARK_SEARCH_INPUT_RGB);

    await clickThemeToggle(page);

    const toggledPresentation = await readThemePresentation(page);
    expect(toggledPresentation.themeTransitions).toBe('enabled');
  });

  test('keeps managed theme-color across client navigation', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await clickThemeToggle(page);
    await expect.poll(() => readTheme(page)).toBe('dark');

    const cardLink = page.locator('.smell-card__link').first();
    const startUrl = page.url();
    await clickStable(cardLink);
    await page.waitForURL((url) => url.pathname.startsWith('/smells/') && url.toString() !== startUrl);
    await expect.poll(() => readTheme(page)).toBe('dark');

    const themeColor = await readActiveThemeColor(page);
    expect(themeColor.isManaged).toBe(true);
    expect(themeColor.content).toBe(THEME_COLOR_DARK);
  });
});
