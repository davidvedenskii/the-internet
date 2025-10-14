import { test, expect } from '@playwright/test';

test.describe('Redirect Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/redirector');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Redirection');
  });

  test('Redirect Link Present', async ({ page }) => {
    // Verify link exists
    const link = page.locator('#redirect');
    await expect(link).toBeVisible();
    await expect(link).toHaveText('here');
  });

  test('Click Redirect Link', async ({ page }) => {
    // Click redirect link
    const link = page.locator('#redirect');
    await link.click();
    
    // Should redirect to status codes page
    await expect(page).toHaveURL(/\/status_codes/);
  });

  test('Redirect Target Page Loads', async ({ page }) => {
    // Click redirect
    await page.locator('#redirect').click();
    
    // Wait for redirect
    await page.waitForURL(/\/status_codes/);
    
    // Verify status codes page loaded
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Status Codes');
  });

  test('Redirect Response Code', async ({ page }) => {
    // Click redirect and capture response
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/status_codes')),
      page.locator('#redirect').click()
    ]);
    
    // Verify successful redirect
    expect(response.status()).toBe(200);
  });

  test('Multiple Redirects', async ({ page }) => {
    // First redirect
    await page.locator('#redirect').click();
    await page.waitForURL(/\/status_codes/);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/redirector/);
    
    // Click again
    await page.locator('#redirect').click();
    await page.waitForURL(/\/status_codes/);
  });
});
