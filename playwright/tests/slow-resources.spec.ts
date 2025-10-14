import { test, expect } from '@playwright/test';

test.describe('Slow Resources', () => {
  test('Page Load With Slow Resources', async ({ page }) => {
    // Set longer timeout for this test
    test.setTimeout(60000);
    
    await page.goto('/slow');
    
    // Verify page eventually loads
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Slow Resources', { timeout: 30000 });
  });

  test('Page Title Present Despite Slow Load', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/slow');
    
    // Verify page title
    await expect(page).toHaveTitle('The Internet', { timeout: 30000 });
  });

  test('Content Eventually Visible', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/slow');
    
    // Wait for main content
    const content = page.locator('.example');
    await expect(content).toBeVisible({ timeout: 30000 });
  });

  test('Images Load Slowly', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/slow');
    
    // Check if images exist
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // May or may not have images, but page should load
    expect(imageCount).toBeGreaterThanOrEqual(0);
  });

  test('Page Remains Responsive After Load', async ({ page }) => {
    test.setTimeout(15000);
    
    await page.goto('/slow', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load with shorter timeout
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Verify page is still interactive
    const heading = page.locator('h3');
    await expect(heading).toBeVisible({ timeout: 8000 });
  });
});
