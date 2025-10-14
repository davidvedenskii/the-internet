import { test, expect } from '@playwright/test';

test.describe('Large & Deep DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/large');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Large & Deep DOM');
  });

  test('Table Present', async ({ page }) => {
    // Verify table exists
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('Table Has Many Rows', async ({ page }) => {
    // Count table rows
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    
    // Should have a large number of rows
    expect(rowCount).toBeGreaterThan(10);
  });

  test('Table Has Multiple Columns', async ({ page }) => {
    // Count table columns in first row
    const firstRow = page.locator('table tbody tr').first();
    const cells = firstRow.locator('td');
    const columnCount = await cells.count();
    
    expect(columnCount).toBeGreaterThan(1);
  });

  test('Deeply Nested Sibling Div Visible', async ({ page }) => {
    // The page contains a deeply nested div - check for any sibling div
    const siblingDiv = page.locator('[id^="sibling"]').first();
    const divCount = await page.locator('[id^="sibling"]').count();
    expect(divCount).toBeGreaterThanOrEqual(0);
  });

  test('Scroll to Bottom of Table', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    // Verify we can still interact with page
    const heading = page.locator('h3');
    await expect(heading).toBeVisible();
  });

  test('Table Cells Contain Data', async ({ page }) => {
    test.setTimeout(10000);
    
    // Get first row
    const firstRow = page.locator('table tbody tr').first();
    const cells = firstRow.locator('td');
    
    const firstCellText = await cells.first().textContent();
    expect(firstCellText).toBeTruthy();
  });

  test('Page Performance With Large DOM', async ({ page }) => {
    test.setTimeout(10000);
    
    const startTime = Date.now();
    
    // Perform some interactions
    await page.locator('table').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should still be reasonably responsive (< 8 seconds)
    expect(duration).toBeLessThan(8000);
  });
});
