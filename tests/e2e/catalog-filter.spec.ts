import { test, expect } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';

function isMobileProject(testInfo: TestInfo): boolean {
  return testInfo.project.name.includes('mobile');
}

async function dismissAnalyticsConsentIfVisible(page: Page, testInfo: TestInfo): Promise<void> {
  const consentHeading = page.getByRole('heading', { name: 'Analytics preference' });
  if (!(await consentHeading.isVisible())) return;

  const declineButton = page.getByRole('button', { name: 'No thanks' });
  await expect(declineButton).toBeVisible();

  if (isMobileProject(testInfo)) {
    await declineButton.evaluate((element: HTMLButtonElement) => {
      element.click();
    });
  } else {
    await declineButton.click();
  }

  await expect(consentHeading).toBeHidden();
}

async function getFilterScope(page: Page, testInfo: TestInfo): Promise<Locator> {
  if (!isMobileProject(testInfo)) {
    return page.locator('.filter-sidebar__desktop');
  }

  const filterFab = page.locator('.filter-sidebar__mobile-fab');
  await expect(filterFab).toBeVisible();
  await filterFab.click({ force: true });

  const mobileSheet = page.locator('.filter-sidebar__sheet.filter-sidebar__sheet--open');
  await expect(mobileSheet).toBeVisible();
  return mobileSheet;
}

async function scrollIntoViewCenter(locator: Locator): Promise<void> {
  await locator.evaluate((element) => {
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
}

test.describe('Catalog Filter', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/');
    await dismissAnalyticsConsentIfVisible(page, testInfo);
    // Wait for cards to be rendered
    await page.waitForSelector('.smell-card');
  });

  test('clicking a chip filters cards', async ({ page }, testInfo) => {
    const totalCards = await page.locator('.smell-card').count();
    const initialCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(initialCards).toBe(totalCards);

    const filterScope = await getFilterScope(page, testInfo);
    const firstChip = filterScope.locator('.filter-sidebar__chip').first();
    await firstChip.click();

    // Wait for filtering to take effect
    await page.waitForTimeout(300);

    const filteredCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(filteredCards).toBeLessThan(totalCards);
    expect(filteredCards).toBeGreaterThan(0);
  });

  test('multi-dimension AND: combining filters narrows results', async ({ page }, testInfo) => {
    const filterScope = await getFilterScope(page, testInfo);

    const filterDimensions = filterScope.locator('.filter-sidebar__dimension');
    const obstructionChip = filterDimensions.first().locator('.filter-sidebar__chip').first();
    await obstructionChip.click();
    await page.waitForTimeout(300);

    const afterFirstFilter = await page.locator('.smell-card:not(.hidden)').count();

    // Click a chip in a different dimension
    const secondDimension = filterDimensions.nth(1);
    const occurrenceChip = secondDimension.locator('.filter-sidebar__chip').first();
    await occurrenceChip.click();
    await page.waitForTimeout(300);

    const afterSecondFilter = await page.locator('.smell-card:not(.hidden)').count();
    expect(afterSecondFilter).toBeLessThanOrEqual(afterFirstFilter);
  });

  test('clear all resets filters', async ({ page }, testInfo) => {
    const totalCards = await page.locator('.smell-card').count();

    const filterScope = await getFilterScope(page, testInfo);
    const firstChip = filterScope.locator('.filter-sidebar__chip').first();
    await firstChip.click();
    await page.waitForTimeout(300);

    const clearBtn = filterScope.locator('.filter-sidebar__clear-btn').first();
    await clearBtn.click();
    await page.waitForTimeout(300);

    const cards = await page.locator('.smell-card:not(.hidden)').count();
    expect(cards).toBe(totalCards);
  });

  test('URL hash updates on filter change', async ({ page }, testInfo) => {
    // Initially no hash
    expect(new URL(page.url()).hash).toBe('');

    const filterScope = await getFilterScope(page, testInfo);
    const firstChip = filterScope.locator('.filter-sidebar__chip').first();
    await firstChip.click();
    await page.waitForTimeout(300);

    // Hash should now be non-empty
    const hash = new URL(page.url()).hash;
    expect(hash.length).toBeGreaterThan(0);
  });

  test('clicking a non-interactive card area still navigates via the stretched link', async ({
    page,
  }, testInfo) => {
    const firstCard = page.locator('.smell-card').first();
    const slug = await firstCard.getAttribute('data-slug');
    if (!slug) throw new Error('Missing card slug');

    await firstCard.scrollIntoViewIfNeeded();
    const box = await firstCard.boundingBox();
    if (!box) throw new Error('Missing card bounds');

    if (testInfo.project.name === 'mobile-safari') {
      await page.touchscreen.tap(box.x + 40, box.y + box.height - 40);
    } else {
      await page.mouse.click(box.x + 40, box.y + box.height - 40);
    }

    await page.waitForURL(new RegExp(`/smells/${slug}$`));
  });

  test('share button copies without navigating away from the catalog', async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions are supported only in Chromium.');

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });

    const shareBtn = page.locator('.smell-card__share').nth(isMobileProject(testInfo) ? 1 : 0);
    const startUrl = page.url();

    await scrollIntoViewCenter(shareBtn);
    if (isMobileProject(testInfo)) {
      await shareBtn.click({ force: true });
    } else {
      await shareBtn.click();
    }

    await expect(page).toHaveURL(startUrl);
    await expect(shareBtn).toHaveAttribute('aria-label', /copied/i);
    await expect(page.locator('#filter-results-live')).toContainText('Link copied to clipboard');
  });

  test('card tag buttons filter without navigating away from the catalog', async ({ page }) => {
    const totalCards = await page.locator('.smell-card').count();
    const firstTag = page.locator('.smell-card__tag').first();
    const startPath = new URL(page.url()).pathname;

    await firstTag.click();

    await expect(firstTag).toHaveAttribute('aria-pressed', 'true');

    const filteredCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(filteredCards).toBeLessThan(totalCards);
    expect(new URL(page.url()).pathname).toBe(startPath);
    expect(new URL(page.url()).hash.length).toBeGreaterThan(0);
  });

  test('keyboard activation on the primary card link navigates', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only keyboard regression');

    const firstCard = page.locator('.smell-card').first();
    const slug = await firstCard.getAttribute('data-slug');
    if (!slug) throw new Error('Missing card slug');

    const firstLink = firstCard.locator('.smell-card__link');
    await firstLink.focus();
    await expect(firstLink).toBeFocused();

    await page.keyboard.press('Enter');

    await page.waitForURL(new RegExp(`/smells/${slug}$`));
  });

  test('keyboard activation on card tag buttons works with Enter and Space', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only keyboard regression');

    const enterTag = page.locator('.smell-card__tag').first();
    await enterTag.focus();
    await expect(enterTag).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(enterTag).toHaveAttribute('aria-pressed', 'true');

    await page.keyboard.press('Enter');
    await expect(enterTag).toHaveAttribute('aria-pressed', 'false');

    const spaceTag = page.locator('.smell-card__tag').nth(1);
    await spaceTag.focus();
    await expect(spaceTag).toBeFocused();

    await page.keyboard.press('Space');
    await expect(spaceTag).toHaveAttribute('aria-pressed', 'true');
    expect(new URL(page.url()).pathname).toBe('/');
    expect(new URL(page.url()).hash.length).toBeGreaterThan(0);
  });
});
