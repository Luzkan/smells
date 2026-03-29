import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function gotoAbout(page: import('@playwright/test').Page) {
  const response = await page.goto('/about');
  await page.waitForSelector('h1');
  return response;
}

function trackConsoleErrors(page: import('@playwright/test').Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

async function setTheme(page: import('@playwright/test').Page, theme: 'light' | 'dark') {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value;
  }, theme);

  const expectedBackground = theme === 'dark' ? 'rgb(23, 20, 18)' : 'rgb(250, 249, 246)';
  await page.waitForFunction(
    (value) => getComputedStyle(document.body).backgroundColor === value,
    expectedBackground,
  );
}

test.describe('About page', () => {
  test('loads the new about narrative and hero CTA', async ({ page }) => {
    const response = await gotoAbout(page);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('About — Code Smells Catalog');
    const heroHeading = page.locator('#sec-hero h1');
    await expect(heroHeading).toContainText(/The catalog that/i);
    await expect(heroHeading).toContainText(/what.?s wrong with your code/i);

    const catalogLink = page.locator('#sec-hero a.cta-button[href="/"]');
    await expect(catalogLink).toBeVisible();
    await expect(catalogLink).toHaveAttribute('href', '/');
    await expect(catalogLink).toHaveText(/Explore the Catalog/i);

    await expect(page.locator('#sec-origin h2')).toHaveText('Why This Catalog Exists');
    await expect(page.locator('#sec-taxonomy h2')).toHaveText('Five Ways to Look at Every Smell');
    await expect(page.locator('#sec-anatomy h2')).toHaveText('Anatomy of a Smell');
    await expect(page.locator('#sec-research h2')).toHaveText('The Research & the Author');
  });

  test('emits no console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page);

    await gotoAbout(page);

    expect(errors).toHaveLength(0);
  });

  test('passes axe-core in light mode', async ({ page }) => {
    await gotoAbout(page);
    await setTheme(page, 'light');

    const results = await new AxeBuilder({ page }).include('#main-content').analyze();

    expect(results.violations).toEqual([]);
  });

  test('passes axe-core in dark mode', async ({ page }) => {
    await gotoAbout(page);
    await setTheme(page, 'dark');

    const results = await new AxeBuilder({ page }).include('#main-content').analyze();

    expect(results.violations).toEqual([]);
  });
});
