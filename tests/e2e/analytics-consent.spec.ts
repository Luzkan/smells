import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { isMobileProject, waitForNextAstroPageLoad } from './helpers';

async function clickConsentAction(
  page: Page,
  name: 'Allow analytics' | 'No thanks',
  testInfo: TestInfo,
): Promise<void> {
  const button = page.getByRole('button', { name });
  const consentHeading = page.getByRole('heading', { name: 'Analytics preference' });
  await expect(button).toBeVisible();

  if (isMobileProject(testInfo)) {
    await button.evaluate((element: HTMLButtonElement) => {
      element.click();
    });
  } else {
    await button.click();
  }

  await expect(consentHeading).toBeHidden();
}

async function navigateToAbout(page: Page, testInfo: TestInfo): Promise<void> {
  const nextAstroPageLoad = waitForNextAstroPageLoad(page);

  if (isMobileProject(testInfo)) {
    const filterOverlay = page.locator('.filter-sidebar__sheet-overlay--open');
    if ((await filterOverlay.count()) > 0) {
      await filterOverlay.first().click({ force: true });
    }

    const hamburger = page.locator('#nav-hamburger');
    await expect(hamburger).toBeVisible();
    await hamburger.click({ force: true });

    const mobileSheet = page.locator('#mobile-nav-sheet.mobile-nav__sheet--open');
    await expect(mobileSheet).toBeVisible();
    await mobileSheet.locator('.mobile-nav__link[href="/about"]').click();
  } else {
    await page.locator('.nav__link[href="/about"]').click();
  }

  await page.waitForURL('**/about');
  await nextAstroPageLoad;
  await expect(page).toHaveTitle('About — Code Smells Catalog');
  await expect(page.locator('#sec-hero h1')).toBeVisible();
}

const GOOGLE_TAG_SHIM = `
(() => {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const originalPush = dataLayer.push.bind(dataLayer);
  let trackingId = null;

  function toArgs(entry) {
    return Array.from(entry || []);
  }

  function sendMeasurement(name, params) {
    if (!trackingId) return;

    const url = new URL('https://www.google-analytics.com/g/collect');
    url.searchParams.set('tid', trackingId);
    url.searchParams.set('en', String(name));

    if (params && typeof params.page_location === 'string') {
      url.searchParams.set('dl', params.page_location);
    }

    if (params && typeof params.page_title === 'string') {
      url.searchParams.set('dt', params.page_title);
    }

    fetch(url.toString(), { mode: 'no-cors', keepalive: true }).catch(() => {});
  }

  function handle(entry) {
    const [command, first, second] = toArgs(entry);

    if (command === 'config' && typeof first === 'string') {
      trackingId = first;
      return;
    }

    if (command === 'event' && typeof first === 'string') {
      sendMeasurement(first, second);
    }
  }

  dataLayer.forEach(handle);
  dataLayer.push = function () {
    for (const entry of arguments) {
      handle(entry);
    }

    return originalPush.apply(this, arguments);
  };
})();
`;

async function createAnalyticsRequestRecorder(page: import('@playwright/test').Page) {
  const tagRequests: string[] = [];
  const measurementRequests: string[] = [];

  await page.route('https://www.googletagmanager.com/gtag/js**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: GOOGLE_TAG_SHIM,
    });
  });

  await page.route('https://www.google-analytics.com/g/collect**', async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  await page.route('https://region1.google-analytics.com/g/collect**', async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  page.on('request', (request) => {
    const url = request.url();

    if (url.startsWith('https://www.googletagmanager.com/gtag/js')) {
      tagRequests.push(url);
      return;
    }

    if (
      url.includes('https://www.google-analytics.com/g/collect') ||
      url.includes('https://region1.google-analytics.com/g/collect')
    ) {
      measurementRequests.push(url);
    }
  });

  return {
    tagRequests,
    measurementRequests,
    pageViewCount() {
      return measurementRequests.filter(
        (url) => new URL(url).searchParams.get('en') === 'page_view',
      ).length;
    },
  };
}

test.describe('Analytics consent', () => {
  test('keeps GA off before consent, then tracks exactly once per page after accept', async ({
    page,
  }, testInfo) => {
    const analytics = await createAnalyticsRequestRecorder(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Analytics preference' })).toBeVisible();
    await page.waitForTimeout(400);

    expect(analytics.tagRequests).toHaveLength(0);
    expect(analytics.pageViewCount()).toBe(0);

    await clickConsentAction(page, 'Allow analytics', testInfo);

    await expect.poll(() => analytics.tagRequests.length).toBe(1);
    await expect.poll(() => analytics.pageViewCount()).toBe(1);

    await navigateToAbout(page, testInfo);

    await expect.poll(() => analytics.pageViewCount(), { timeout: 10000 }).toBe(2);
  });

  test('keeps GA disabled after decline, including after Astro navigation', async ({
    page,
  }, testInfo) => {
    const analytics = await createAnalyticsRequestRecorder(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Analytics preference' })).toBeVisible();

    await clickConsentAction(page, 'No thanks', testInfo);
    await page.waitForTimeout(400);

    expect(analytics.tagRequests).toHaveLength(0);
    expect(analytics.pageViewCount()).toBe(0);

    await navigateToAbout(page, testInfo);
    await page.waitForTimeout(400);

    expect(analytics.tagRequests).toHaveLength(0);
    expect(analytics.pageViewCount()).toBe(0);
  });

  test('stored granted consent does not double count the initial page view', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('analytics-consent', 'granted');
    });

    const analytics = await createAnalyticsRequestRecorder(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Analytics preference' })).toBeHidden();

    await expect.poll(() => analytics.tagRequests.length).toBe(1);
    await expect.poll(() => analytics.pageViewCount()).toBe(1);
    await page.waitForTimeout(400);

    expect(analytics.pageViewCount()).toBe(1);
  });
});
