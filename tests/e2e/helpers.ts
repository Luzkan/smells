import type { Page, TestInfo } from '@playwright/test';

export function isMobileProject(testInfo: TestInfo): boolean {
  return testInfo.project.name.includes('mobile');
}

/**
 * Registers a one-shot listener for the next `astro:page-load` event.
 * Call **before** triggering navigation so the listener is in place
 * before the event fires — avoids a race condition with view transitions.
 */
export function waitForNextAstroPageLoad(page: Page): Promise<void> {
  return page.evaluate(() => {
    return new Promise<void>((resolve) => {
      document.addEventListener('astro:page-load', () => resolve(), { once: true });
    });
  });
}

export async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value;
  }, theme);

  const expectedBackground = theme === 'dark' ? 'rgb(23, 20, 18)' : 'rgb(250, 249, 246)';
  await page.waitForFunction(
    (value) => getComputedStyle(document.body).backgroundColor === value,
    expectedBackground,
  );
}

/**
 * Collects console errors emitted on `page`.
 * Pass `ignore` to suppress known-expected messages (e.g. the 404 resource error).
 */
export function trackConsoleErrors(page: Page, ignore?: Set<string>): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !ignore?.has(msg.text())) {
      errors.push(msg.text());
    }
  });
  return errors;
}
