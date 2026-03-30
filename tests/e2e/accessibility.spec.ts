import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  DARK_THEME,
  LIGHT_THEME,
  THEME_ATTRIBUTE,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_STORAGE_KEY,
  type Theme,
} from '../../src/lib/theme-contract';

async function elementIsInert(page: Page, selector: string): Promise<boolean> {
  return page.locator(selector).evaluate((element) => element.hasAttribute('inert'));
}

async function mobileNavSheetIsInert(page: Page): Promise<boolean> {
  return elementIsInert(page, '#mobile-nav-sheet');
}

function buildCatalogAxe(page: import('@playwright/test').Page): AxeBuilder {
  return new AxeBuilder({ page });
}

function buildArticleAxe(page: Page): AxeBuilder {
  return new AxeBuilder({ page });
}

async function expectUniqueNamedNavigation(page: Page, name: string): Promise<void> {
  await expect(page.getByRole('navigation', { name })).toHaveCount(1);
}

function themeBackground(theme: Theme): string {
  const hex = theme === DARK_THEME ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  const normalized = hex.replace('#', '');
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgb(${red}, ${green}, ${blue})`;
}

async function seedTheme(page: Page, theme: Theme): Promise<void> {
  await page.addInitScript(
    ({ storageKey, themeValue }) => {
      try {
        globalThis.localStorage.setItem(storageKey, themeValue);
      } catch {
        // Ignore storage failures in test setup and let the page fall back naturally.
      }
    },
    { storageKey: THEME_STORAGE_KEY, themeValue: theme },
  );
}

async function expectThemeApplied(page: Page, theme: Theme): Promise<void> {
  const expectedBackground = themeBackground(theme);
  await page.waitForFunction(
    ({ expectedTheme, expectedBg, themeAttribute }) => {
      const root = document.documentElement;
      const rootStyle = getComputedStyle(root);
      const bodyStyle = getComputedStyle(document.body);
      return (
        root.getAttribute(themeAttribute) === expectedTheme &&
        rootStyle.backgroundColor === expectedBg &&
        bodyStyle.backgroundColor === expectedBg &&
        rootStyle.colorScheme === expectedTheme
      );
    },
    { expectedTheme: theme, expectedBg: expectedBackground, themeAttribute: THEME_ATTRIBUTE },
  );
}

async function gotoCatalog(page: Page, theme: Theme) {
  await seedTheme(page, theme);
  const response = await page.goto('/');
  await expectThemeApplied(page, theme);
  await page.waitForSelector('.smell-card');
  return response;
}

async function gotoFeatureEnvy(page: Page, theme: Theme = LIGHT_THEME) {
  await seedTheme(page, theme);
  const response = await page.goto('/smells/feature-envy');
  await expectThemeApplied(page, theme);
  await page.waitForSelector('.article-hero__title');
  return response;
}

async function waitForArticleAnimations(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.problem-card'));
    return cards.every((card) => getComputedStyle(card).opacity === '1');
  });
}

test.describe('Accessibility', () => {
  test('catalog page passes axe-core in light mode', async ({ page }) => {
    test.slow();

    await gotoCatalog(page, LIGHT_THEME);

    const results = await buildCatalogAxe(page).analyze();

    expect(results.violations).toEqual([]);
  });

  test('catalog page passes axe-core in dark mode', async ({ page }) => {
    test.slow();

    await gotoCatalog(page, DARK_THEME);

    const results = await buildCatalogAxe(page).analyze();

    expect(results.violations).toEqual([]);
  });

  test('feature envy article passes axe-core in light mode', async ({ page }) => {
    test.slow();

    const response = await gotoFeatureEnvy(page, LIGHT_THEME);
    expect(response?.status()).toBe(200);
    await waitForArticleAnimations(page);

    const results = await buildArticleAxe(page).analyze();

    expect(results.violations).toEqual([]);
  });

  test('feature envy article passes axe-core in dark mode', async ({ page }) => {
    test.slow();

    await gotoFeatureEnvy(page, DARK_THEME);
    await waitForArticleAnimations(page);

    const results = await buildArticleAxe(page).analyze();

    expect(results.violations).toEqual([]);
  });

  test('primary navigation is exposed as a unique named landmark', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.smell-card');

    await expectUniqueNamedNavigation(page, 'Primary navigation');
  });

  test('desktop article pages expose disambiguated navigation landmarks', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only landmark regression');

    const response = await gotoFeatureEnvy(page);
    expect(response?.status()).toBe(200);

    await expectUniqueNamedNavigation(page, 'Primary navigation');
    await expectUniqueNamedNavigation(page, 'Breadcrumb');
    await expectUniqueNamedNavigation(page, 'Table of Contents');
    await expectUniqueNamedNavigation(page, 'Previous and next articles');
    await expectUniqueNamedNavigation(page, 'Footer navigation');
  });

  test('desktop tab order never reaches closed article engagement panels', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only keyboard regression');

    await gotoFeatureEnvy(page);

    const shareButton = page.locator('.engage-share__btn');
    const shareDropdown = page.locator('#share-dropdown-feature-envy');
    const citeButton = page.locator('.engage-cite__btn');
    const citePanel = page.locator('#cite-panel');

    await expect(shareDropdown).toHaveAttribute('aria-hidden', 'true');
    expect(await elementIsInert(page, '#share-dropdown-feature-envy')).toBe(true);
    await shareButton.focus();
    await page.keyboard.press('Tab');
    const activeInsideShareDropdown = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('#share-dropdown-feature-envy')),
    );
    expect(activeInsideShareDropdown).toBe(false);

    await expect(citePanel).toHaveAttribute('aria-hidden', 'true');
    expect(await elementIsInert(page, '#cite-panel')).toBe(true);
    await citeButton.focus();
    await page.keyboard.press('Tab');
    const activeInsideCitePanel = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('#cite-panel')),
    );
    expect(activeInsideCitePanel).toBe(false);
  });

  test('desktop tab order never reaches the closed mobile filter sheet', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only keyboard regression');

    await page.goto('/');
    await expect(page.locator('.filter-sidebar__desktop')).toBeVisible();

    const sheet = page.locator('.filter-sidebar__sheet');
    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    await expect(sheet).toHaveAttribute('aria-modal', 'false');
    expect(await elementIsInert(page, '.filter-sidebar__sheet')).toBe(true);

    const lastDesktopSidebarButton = page
      .locator('.filter-sidebar__desktop button:not([disabled]):visible')
      .last();
    await lastDesktopSidebarButton.focus();
    await page.keyboard.press('Tab');
    const activeInsideSheet = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('.filter-sidebar__sheet')),
    );
    expect(activeInsideSheet).toBe(false);
  });

  test('desktop tab order never reaches the closed mobile nav sheet', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only keyboard regression');

    await page.goto('/');

    const sheet = page.locator('#mobile-nav-sheet');
    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    expect(await mobileNavSheetIsInert(page)).toBe(true);

    for (let step = 0; step < 8; step += 1) {
      await page.keyboard.press('Tab');
      const activeInsideSheet = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('#mobile-nav-sheet')),
      );
      expect(activeInsideSheet).toBe(false);
    }
  });

  test('mobile nav opens accessibly and restores its closed state after dismiss/navigation', async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile-only keyboard regression');

    await page.goto('/');

    const hamburger = page.locator('#nav-hamburger');
    const sheet = page.locator('#mobile-nav-sheet');
    const overlay = page.locator('#mobile-nav-overlay');

    await expect(hamburger).toBeVisible();
    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(await mobileNavSheetIsInert(page)).toBe(true);

    await hamburger.focus();
    await page.keyboard.press('Enter');

    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    await expect(sheet).toHaveAttribute('aria-hidden', 'false');
    await expect(overlay).toHaveAttribute('aria-hidden', 'false');
    expect(await mobileNavSheetIsInert(page)).toBe(false);
    await expect(sheet.locator('.mobile-nav__link').first()).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(await mobileNavSheetIsInert(page)).toBe(true);
    await expect(hamburger).toBeFocused();

    await hamburger.focus();
    await page.keyboard.press('Enter');
    await sheet.locator('a[href="/about"]').click();
    await page.waitForURL(/\/about$/);

    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    expect(await mobileNavSheetIsInert(page)).toBe(true);
  });

  test('mobile footer panels stay inert until expanded', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile-only keyboard regression');

    await page.goto('/');

    const mobileCiteToggle = page.locator('#mobileCiteToggle');
    const mobileCiteBody = page.locator('#mobileCiteBody');
    const mobileCiteCopyButton = page.locator('#mobileCiteCopyBtn');
    const firstAccordionHeader = page.locator('.footer-accordion-header').first();
    const firstAccordionBody = page.locator('.footer-accordion-body').first();
    const firstAccordionAction = firstAccordionBody.locator('a, button').first();

    await mobileCiteToggle.scrollIntoViewIfNeeded();
    await expect(mobileCiteToggle).toHaveAttribute('aria-controls', 'mobileCiteBody');
    await expect(mobileCiteBody).toHaveAttribute('aria-hidden', 'true');
    expect(await elementIsInert(page, '#mobileCiteBody')).toBe(true);

    const focusEnteredClosedCiteBody = await page.evaluate(() => {
      const button = document.getElementById('mobileCiteCopyBtn');
      if (button instanceof HTMLElement) {
        button.focus();
      }
      return Boolean(document.activeElement?.closest('#mobileCiteBody'));
    });
    expect(focusEnteredClosedCiteBody).toBe(false);

    await mobileCiteToggle.press('Enter');

    await expect(mobileCiteBody).toHaveAttribute('aria-hidden', 'false');
    expect(await elementIsInert(page, '#mobileCiteBody')).toBe(false);

    const focusEnteredOpenCiteBody = await page.evaluate(() => {
      const button = document.getElementById('mobileCiteCopyBtn');
      if (button instanceof HTMLElement) {
        button.focus();
      }
      return Boolean(document.activeElement?.closest('#mobileCiteBody'));
    });
    expect(focusEnteredOpenCiteBody).toBe(true);
    await expect(mobileCiteCopyButton).toBeFocused();

    const firstAccordionBodyId = await firstAccordionBody.getAttribute('id');
    await expect(firstAccordionHeader).toHaveAttribute('aria-controls', firstAccordionBodyId ?? '');
    await expect(firstAccordionBody).toHaveAttribute('aria-hidden', 'true');
    expect(await firstAccordionBody.evaluate((element) => element.hasAttribute('inert'))).toBe(
      true,
    );

    const focusEnteredClosedAccordionBody = await page.evaluate(() => {
      const action = document.querySelector<HTMLElement>(
        '.footer-accordion-body a, .footer-accordion-body button',
      );
      action?.focus();
      return Boolean(document.activeElement?.closest('.footer-accordion-body'));
    });
    expect(focusEnteredClosedAccordionBody).toBe(false);

    await firstAccordionHeader.press('Enter');

    await expect(firstAccordionBody).toHaveAttribute('aria-hidden', 'false');
    expect(await firstAccordionBody.evaluate((element) => element.hasAttribute('inert'))).toBe(
      false,
    );

    const focusEnteredOpenAccordionBody = await page.evaluate(() => {
      const action = document.querySelector<HTMLElement>(
        '.footer-accordion-body a, .footer-accordion-body button',
      );
      action?.focus();
      return Boolean(document.activeElement?.closest('.footer-accordion-body'));
    });
    expect(focusEnteredOpenAccordionBody).toBe(true);
    await expect(firstAccordionAction).toBeFocused();
  });
});
