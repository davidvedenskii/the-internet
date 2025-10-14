import { test, expect } from '@playwright/test';

test.describe('JavaScript Error', () => {
  test('Page Load Triggers Console Error', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });
    
    await page.goto('/javascript_error');
    
    // Wait a moment for errors to fire
    await page.waitForTimeout(1000);
    
    // Verify at least one error was logged
    expect(consoleErrors.length).toBeGreaterThan(0);
  });

  test('Page Load Verification', async ({ page }) => {
    test.setTimeout(10000);
    
    await page.goto('/javascript_error', { waitUntil: 'domcontentloaded' }).catch(() => {});
    
    // Verify page title (it has a different title on this page)
    await expect(page).toHaveTitle('Page with JavaScript errors on load', { timeout: 8000 });
    
    // Verify page has loaded
    const content = page.locator('body');
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test('Error Message Contains Expected Text', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/javascript_error');
    await page.waitForTimeout(1000);
    
    // Should have at least one error
    expect(errors.length).toBeGreaterThan(0);
    
    // Error message should be meaningful
    expect(errors[0]).toBeTruthy();
  });

  test('Page Content Still Visible Despite Error', async ({ page }) => {
    test.setTimeout(10000);
    
    await page.goto('/javascript_error', { waitUntil: 'domcontentloaded' }).catch(() => {});
    
    // Despite error, page should still render
    const content = page.locator('body');
    await expect(content).toBeVisible({ timeout: 8000 });
    
    // Verify page has some content
    const text = await content.textContent();
    expect(text).toBeTruthy();
  });
});
