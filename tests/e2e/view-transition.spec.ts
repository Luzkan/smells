import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('content/smells');
const smellSlugs = fs
  .readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace('.md', ''));

async function waitForArticleTransitionReady(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('.article-hero__title')).toBeVisible();
  await page.waitForFunction(
    () => document.documentElement.dataset.initialTransitions !== 'locked',
  );
}

async function scrollWindowInstantly(page: Page, top: number): Promise<void> {
  await page.evaluate((nextTop) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: nextTop, left: 0, behavior: 'auto' });
    root.style.scrollBehavior = previousScrollBehavior;
  }, top);
}

async function scrollElementIntoViewCenter(locator: Locator): Promise<void> {
  await locator.evaluate((element) => {
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
}

async function clickStable(locator: Locator): Promise<void> {
  await scrollElementIntoViewCenter(locator);
  await expect(locator).toBeVisible();

  try {
    await locator.click({ timeout: 3000 });
  } catch {
    await locator.click({ force: true });
  }
}

async function navigateToLinkedArticle(page: Page, locator: Locator): Promise<void> {
  const startUrl = page.url();
  await clickStable(locator);
  await page.waitForURL(
    (url) => url.pathname.startsWith('/smells/') && url.toString() !== startUrl,
  );
  await waitForArticleTransitionReady(page);
}

test.describe('View Transitions — catalog ↔ article', () => {
  test('navigating to an article page renders article content', async ({ page }) => {
    await page.goto('/smells/feature-envy');
    await expect(page).toHaveTitle(/Feature Envy/);

    // Article hero should be visible
    const hero = page.locator('.article-hero__title');
    await expect(hero).toBeVisible();
    await expect(hero).toHaveText('Feature Envy');

    // Breadcrumb should be present
    const breadcrumb = page.locator('.article-hero__breadcrumb');
    await expect(breadcrumb).toBeVisible();

    // Table of Contents should exist (may be hidden on small viewports)
    const toc = page.locator('.toc');
    await expect(toc).toBeAttached();
  });

  test('article page has prev/next navigation', async ({ page }) => {
    await page.goto('/smells/feature-envy');

    const nav = page.locator('.prev-next');
    await expect(nav).toBeVisible();

    const cards = nav.locator('.prev-next__card');
    const nextCard = page.locator('.prev-next__card--next');

    expect(await cards.count()).toBeGreaterThan(0);

    // Clicking next navigates to another article
    if ((await nextCard.count()) > 0) {
      await navigateToLinkedArticle(page, nextCard);
    } else {
      await navigateToLinkedArticle(page, cards.first());
    }
    await expect(page.locator('.article-hero__title')).toBeVisible();
  });

  test('Nav persists across page navigation', async ({ page }) => {
    await page.goto('/smells/magic-number');

    // Nav should be visible
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();

    // Navigate to another page
    const nextCard = page.locator('.prev-next__card--next');
    await navigateToLinkedArticle(page, nextCard);

    // Nav should still be present (persisted via transition:persist)
    await expect(nav).toBeVisible();
  });

  test('nav shadow and engagement controls survive multiple transitions', async ({ page }) => {
    await page.goto('/smells/feature-envy');
    await waitForArticleTransitionReady(page);

    const nav = page.locator('.nav');
    for (let i = 0; i < 3; i++) {
      await scrollWindowInstantly(page, 200);
      await expect(nav).toHaveClass(/nav--scrolled/);

      const nextCard = page.locator('.prev-next__card--next');
      await navigateToLinkedArticle(page, nextCard);
    }

    const shareButton = page.locator('.engage-share__btn').first();
    const shareDropdown = page.locator('.share-dropdown').first();
    await clickStable(shareButton);
    await expect(shareDropdown).toHaveClass(/share-dropdown--open/);

    await clickStable(shareButton);
    await expect(shareDropdown).not.toHaveClass(/share-dropdown--open/);

    const citeButton = page.locator('.engage-cite__btn').first();
    const citePanel = page.locator('#cite-panel');
    await clickStable(citeButton);
    await expect(citePanel).toHaveAttribute('aria-hidden', 'false');
    await clickStable(citeButton);
    await expect(citePanel).toHaveAttribute('aria-hidden', 'true');
  });

  test('catalog -> article -> back preserves state', async ({ page }) => {
    // Start at catalog
    await page.goto('/');

    // Navigate to an article via direct URL
    await page.goto('/smells/long-method');
    await expect(page).toHaveTitle(/Long Method/);

    // Navigate back
    await page.goBack();
    await page.waitForURL('/');
  });

  test('article sidebar shows related smells', async ({ page }) => {
    await page.goto('/smells/feature-envy');

    // Related smells should be present
    const relatedSmells = page.locator('.related-smell');
    const count = await relatedSmells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('article page renders code example island for pages with examples', async ({ page }) => {
    await page.goto('/smells/feature-envy');

    // CodeExample island should be present (loaded via client:visible)
    const codeExample = page.locator('.code-example');
    // Scroll into view to trigger client:visible hydration
    if ((await codeExample.count()) > 0) {
      await codeExample.first().scrollIntoViewIfNeeded();
      await expect(codeExample.first()).toBeVisible();
    }
  });

  test('all article pages return 200', async ({ request }) => {
    for (const slug of smellSlugs) {
      const response = await request.get(`/smells/${slug}`);
      expect(response.status(), `Expected /smells/${slug} to return 200`).toBe(200);
    }
  });
});
