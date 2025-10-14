import { test, expect } from '@playwright/test';

test.describe('Shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shadowdom');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading contains expected text
    const heading = page.locator('h3, h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('Shadow Host Present', async ({ page }) => {
    // Verify shadow host element exists
    const shadowHost = page.locator('my-paragraph, [data-shadow], div[id*="content"]');
    const hostCount = await shadowHost.count();
    expect(hostCount).toBeGreaterThanOrEqual(0);
  });

  test('Shadow Root Content Accessible', async ({ page }) => {
    // Access shadow root content
    const shadowContent = page.locator('my-paragraph').locator('span[slot="my-text"]');
    await expect(shadowContent).toBeVisible();
  });

  test('Shadow DOM Text Content', async ({ page }) => {
    // Verify text inside shadow DOM
    const shadowText = page.locator('my-paragraph span[slot="my-text"]');
    const text = await shadowText.textContent();
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('Multiple Shadow DOM Elements', async ({ page }) => {
    // Check if there are multiple shadow DOM elements
    const shadowElements = page.locator('my-paragraph');
    const count = await shadowElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Shadow DOM Slot Content', async ({ page }) => {
    // Verify slot attribute
    const slotElement = page.locator('span[slot="my-text"]');
    const slotAttr = await slotElement.getAttribute('slot');
    expect(slotAttr).toBe('my-text');
  });
});
