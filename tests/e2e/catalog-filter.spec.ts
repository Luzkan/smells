import { test, expect } from '@playwright/test';

test.describe('Catalog Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for cards to be rendered
    await page.waitForSelector('.smell-card');
  });

  test('clicking a chip filters cards', async ({ page }) => {
    const totalCards = await page.locator('.smell-card').count();
    const initialCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(initialCards).toBe(totalCards);

    // Click the first chip in the sidebar (desktop only)
    const firstChip = page.locator('.filter-sidebar__chip').first();
    await firstChip.click();

    // Wait for filtering to take effect
    await page.waitForTimeout(300);

    const filteredCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(filteredCards).toBeLessThan(totalCards);
    expect(filteredCards).toBeGreaterThan(0);
  });

  test('multi-dimension AND: combining filters narrows results', async ({ page }) => {
    // Click a chip in the first dimension
    const obstructionChip = page
      .locator('.filter-sidebar__dimension')
      .first()
      .locator('.filter-sidebar__chip')
      .first();
    await obstructionChip.click();
    await page.waitForTimeout(300);

    const afterFirstFilter = await page.locator('.smell-card:not(.hidden)').count();

    // Click a chip in a different dimension
    const secondDimension = page.locator('.filter-sidebar__dimension').nth(1);
    const occurrenceChip = secondDimension.locator('.filter-sidebar__chip').first();
    await occurrenceChip.click();
    await page.waitForTimeout(300);

    const afterSecondFilter = await page.locator('.smell-card:not(.hidden)').count();
    expect(afterSecondFilter).toBeLessThanOrEqual(afterFirstFilter);
  });

  test('clear all resets filters', async ({ page }) => {
    const totalCards = await page.locator('.smell-card').count();

    // Click a chip
    const firstChip = page.locator('.filter-sidebar__chip').first();
    await firstChip.click();
    await page.waitForTimeout(300);

    // Click "Clear all" button
    const clearBtn = page.locator('.filter-sidebar__clear-btn').first();
    await clearBtn.click();
    await page.waitForTimeout(300);

    const cards = await page.locator('.smell-card:not(.hidden)').count();
    expect(cards).toBe(totalCards);
  });

  test('URL hash updates on filter change', async ({ page }) => {
    // Initially no hash
    expect(new URL(page.url()).hash).toBe('');

    // Click a chip
    const firstChip = page.locator('.filter-sidebar__chip').first();
    await firstChip.click();
    await page.waitForTimeout(300);

    // Hash should now be non-empty
    const hash = new URL(page.url()).hash;
    expect(hash.length).toBeGreaterThan(0);
  });

  test('clicking a non-interactive card area still navigates via the stretched link', async ({
    page,
  }) => {
    const firstCard = page.locator('.smell-card').first();
    const slug = await firstCard.getAttribute('data-slug');
    if (!slug) throw new Error('Missing card slug');

    await firstCard.scrollIntoViewIfNeeded();
    const box = await firstCard.boundingBox();
    if (!box) throw new Error('Missing card bounds');

    await page.mouse.click(box.x + 40, box.y + box.height - 40);

    await page.waitForURL(new RegExp(`/smells/${slug}$`));
  });

  test('share button copies without navigating away from the catalog', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: new URL(page.url()).origin,
    });

    const shareBtn = page.locator('.smell-card__share').first();
    const startUrl = page.url();

    await shareBtn.click();

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
