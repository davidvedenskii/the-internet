import { test, expect } from '@playwright/test';

test.describe('Status Codes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/status_codes');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Status Codes');
  });

  test('Status Code Links Present', async ({ page }) => {
    // Verify all status code links exist
    await expect(page.locator('a[href="status_codes/200"]')).toBeVisible();
    await expect(page.locator('a[href="status_codes/301"]')).toBeVisible();
    await expect(page.locator('a[href="status_codes/404"]')).toBeVisible();
    await expect(page.locator('a[href="status_codes/500"]')).toBeVisible();
  });

  test('200 Status Code', async ({ page }) => {
    const response = await page.goto('/status_codes/200');
    expect(response?.status()).toBe(200);
    
    // Verify page content
    const content = page.locator('p');
    await expect(content).toContainText('200');
  });

  test('301 Status Code', async ({ page }) => {
    const response = await page.goto('/status_codes/301');
    // After redirect, should get 200 or could be 301
    const status = response?.status();
    expect([200, 301]).toContain(status);
  });

  test('404 Status Code', async ({ page }) => {
    const response = await page.goto('/status_codes/404');
    expect(response?.status()).toBe(404);
    
    // Verify page content mentions 404
    const content = page.locator('p');
    await expect(content).toContainText('404');
  });

  test('500 Status Code', async ({ page }) => {
    const response = await page.goto('/status_codes/500');
    expect(response?.status()).toBe(500);
    
    // Verify page content mentions 500
    const content = page.locator('p');
    await expect(content).toContainText('500');
  });

  test('Navigate Through Status Code Links', async ({ page }) => {
    // Click 200 link
    await page.locator('a[href="status_codes/200"]').click();
    await expect(page).toHaveURL(/200/);
    
    // Go back
    await page.goBack();
    
    // Click 404 link
    await page.locator('a[href="status_codes/404"]').click();
    await expect(page).toHaveURL(/404/);
  });

  test('Back to Status Codes Link', async ({ page }) => {
    // Navigate to a status code
    await page.goto('/status_codes/200');
    
    // Click back link
    const backLink = page.locator('a[href="/status_codes"]');
    await backLink.click();
    
    // Verify back on main status codes page
    await expect(page).toHaveURL(/\/status_codes$/);
  });
});
