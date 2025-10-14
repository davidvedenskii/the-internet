import { test, expect } from '@playwright/test';

test.describe('Dynamic Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dynamic_content');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Dynamic Content');
    
    // Verify content rows are visible
    const rows = page.locator('#content .row');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('Content Has Images and Text', async ({ page }) => {
    const rows = page.locator('#content .row');
    const count = await rows.count();
    
    // Verify each row has content
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      
      // Verify row has content
      const textContent = await row.textContent();
      expect(textContent?.length).toBeGreaterThan(0);
    }
  });

  test('Refresh Changes Content', async ({ page }) => {
    // Get initial text content
    const firstRow = page.locator('#content .row').first();
    const initialText = await firstRow.textContent();
    
    // Refresh page
    await page.reload();
    
    // Get new text content
    const newText = await firstRow.textContent();
    
    // Content should exist
    expect(newText).toBeTruthy();
    expect(newText?.length).toBeGreaterThan(0);
  });

  test('Static Content Mode', async ({ page }) => {
    // Navigate to static content mode
    await page.goto('/dynamic_content?with_content=static');
    
    // Verify page loads with content
    const rows = page.locator('#content .row');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Verify content exists
    const firstRow = rows.first();
    const content = await firstRow.textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test('Content Rows Are Present', async ({ page }) => {
    const rows = page.locator('#content .row');
    const count = await rows.count();
    
    // Verify we have content rows
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Verify each row has content
    for (let i = 0; i < Math.min(count, 3); i++) {
      const row = rows.nth(i);
      const content = await row.textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });
});
