import { test, expect } from '@playwright/test';

test.describe('No Flash / Initial Load', () => {
  test('all cards are visible on clean load', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.smell-card', { state: 'attached' });

    const totalCards = await page.locator('.smell-card').count();
    const visibleCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(visibleCards).toBe(totalCards);
  });

  test('hash cold load shows correct filtered view', async ({ page }) => {
    // Navigate directly with a hash that filters to Bloaters
    await page.goto('/#obstruction=Bloaters');
    await page.waitForSelector('.smell-card', { state: 'attached' });
    await page.waitForTimeout(500);

    const totalCards = await page.locator('.smell-card').count();
    const visibleCards = await page.locator('.smell-card:not(.hidden)').count();
    expect(visibleCards).toBeGreaterThan(0);
    expect(visibleCards).toBeLessThan(totalCards);
  });
});
