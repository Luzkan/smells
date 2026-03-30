import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setTheme, trackConsoleErrors } from './helpers';

const EXPECTED_404_ERROR = new Set([
  'Failed to load resource: the server responded with a status of 404 (Not Found)',
]);

async function gotoNotFound(page: import('@playwright/test').Page, path: string) {
  const response = await page.goto(path);
  await page.waitForSelector('.page-404');
  await page.waitForSelector('#diagnosisQuote .smell-name');
  return response;
}

async function waitFor404Animations(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const trustLine = document.querySelector('.trust-line-404');
    return trustLine instanceof HTMLElement && getComputedStyle(trustLine).opacity === '1';
  });
}

test.describe('Not found page', () => {
  test('renders the custom 404 page for a missing route', async ({ page }) => {
    const errors = trackConsoleErrors(page, EXPECTED_404_ERROR);
    const response = await gotoNotFound(page, '/this-page-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.locator('.page-404')).toBeVisible();
    await expect(page.locator('.headline-404')).toContainText('Dead Code');
    await expect(page.locator('.actions-404 a[href="/"]')).toBeVisible();
    await expect(page.locator('.actions-404 a[href="/"]')).toHaveAttribute('href', '/');
    await expect(page.locator('#goBackBtn')).toBeVisible();
    await expect(page.locator('#diagnosisQuote .smell-name')).toBeVisible();
    await expect(page.locator('#diagnosisQuote')).not.toHaveText('');

    expect(errors).toHaveLength(0);
  });

  test('go back returns the visitor to the previous page', async ({ page }) => {
    await page.goto('/smells/feature-envy');
    await gotoNotFound(page, '/this-page-does-not-exist');

    await page.locator('#goBackBtn').click();

    await expect(page).toHaveURL(/\/smells\/feature-envy$/);
    await expect(page.locator('.article-hero__title')).toHaveText('Feature Envy');
  });

  test('typo recovery suggests the closest smell and navigates there', async ({ page }) => {
    const response = await gotoNotFound(page, '/feature-envi');

    expect(response?.status()).toBe(404);

    const suggestionLink = page.locator('#suggestion404 a');
    await expect(suggestionLink).toBeVisible();
    await expect(suggestionLink).toHaveAttribute('href', '/smells/feature-envy');
    await expect(suggestionLink).toContainText('Did you mean');
    await expect(suggestionLink).toContainText('Feature Envy');

    await Promise.all([
      page.waitForURL(/\/smells\/feature-envy$/),
      suggestionLink.click({ force: true }),
    ]);
    await expect(page.locator('.article-hero__title')).toHaveText('Feature Envy');
  });

  test('shuffle rotates the diagnosis content', async ({ page }) => {
    await gotoNotFound(page, '/this-page-does-not-exist');

    const diagnosis = page.locator('#diagnosisQuote');
    const initialText = await diagnosis.innerText();
    expect(initialText.trim().length).toBeGreaterThan(0);

    await page.locator('#shuffleBtn').click();

    await expect(diagnosis).not.toHaveText(initialText);
  });

  test('share button shows copied feedback in desktop Chromium', async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName !== 'chromium' || testInfo.project.name.includes('mobile'),
      'Clipboard feedback is asserted only in desktop Chromium variants.',
    );

    await page.addInitScript(() => {
      try {
        Object.defineProperty(globalThis.navigator, 'share', {
          configurable: true,
          value: undefined,
        });
      } catch {
        // Some runtimes may not allow overriding navigator.share.
      }
    });

    await gotoNotFound(page, '/this-page-does-not-exist');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });

    const shareButton = page.locator('#shareBtn');
    await shareButton.click();

    await expect(shareButton).toHaveClass(/copied/);
  });

  test('passes axe-core in light mode', async ({ page }) => {
    await gotoNotFound(page, '/this-page-does-not-exist');
    await setTheme(page, 'light');
    await waitFor404Animations(page);

    const results = await new AxeBuilder({ page }).include('.page-404').analyze();

    expect(results.violations).toEqual([]);
  });

  test('passes axe-core in dark mode', async ({ page }) => {
    await gotoNotFound(page, '/this-page-does-not-exist');
    await setTheme(page, 'dark');
    await waitFor404Animations(page);

    const results = await new AxeBuilder({ page }).include('.page-404').analyze();

    expect(results.violations).toEqual([]);
  });
});
