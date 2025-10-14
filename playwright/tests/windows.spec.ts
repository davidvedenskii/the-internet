import { test, expect } from '@playwright/test';

test.describe('Multiple Windows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/windows');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Opening a new window');
    
    // Verify link is visible
    await expect(page.getByRole('link', { name: 'Click Here' })).toBeVisible();
  });

  test('Open New Window', async ({ page, context }) => {
    // Start waiting for new page before clicking
    const pagePromise = context.waitForEvent('page');
    
    // Click the link
    await page.click('a[href="/windows/new"]');
    
    // Wait for new page
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify new page opened
    expect(newPage.url()).toContain('/windows/new');
    
    // Verify new page content
    const newPageHeading = newPage.locator('h3');
    await expect(newPageHeading).toHaveText('New Window');
    
    // Close new page
    await newPage.close();
  });

  test('Original Window Remains', async ({ page, context }) => {
    // Get original URL
    const originalUrl = page.url();
    
    // Open new window
    const pagePromise = context.waitForEvent('page');
    await page.click('a[href="/windows/new"]');
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify original page is still accessible
    expect(page.url()).toBe(originalUrl);
    await expect(page.locator('h3')).toHaveText('Opening a new window');
    
    // Close new page
    await newPage.close();
  });

  test('Switch Between Windows', async ({ page, context }) => {
    // Open new window
    const pagePromise = context.waitForEvent('page');
    await page.click('a[href="/windows/new"]');
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify we can interact with new page
    await expect(newPage.locator('h3')).toHaveText('New Window');
    
    // Verify we can still interact with original page
    await expect(page.locator('h3')).toHaveText('Opening a new window');
    
    // Close new page
    await newPage.close();
  });

  test('New Window Has Correct Content', async ({ page, context }) => {
    // Open new window
    const pagePromise = context.waitForEvent('page');
    await page.click('a[href="/windows/new"]');
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify new window content
    const heading = newPage.locator('h3');
    await expect(heading).toHaveText('New Window');
    
    // Verify it has different content from original
    const newPageText = await newPage.textContent('body');
    const originalPageText = await page.textContent('body');
    expect(newPageText).not.toBe(originalPageText);
    
    // Close new page
    await newPage.close();
  });
});
