import { test, expect } from '@playwright/test';

test.describe('Challenging DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenging_dom');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Challenging DOM');
  });

  test('Canvas Element Present', async ({ page }) => {
    // Verify canvas is present
    const canvas = page.locator('#canvas');
    await expect(canvas).toBeVisible();
  });

  test('Three Buttons Present', async ({ page }) => {
    // Verify all three buttons with different classes
    const buttons = page.locator('.button, .button.alert, .button.success');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(3);
    
    // Verify first button is visible
    await expect(buttons.first()).toBeVisible();
  });

  test('Table with Data Present', async ({ page }) => {
    // Verify table exists
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Verify table has headers
    const headers = table.locator('thead th');
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
    
    // Verify table has rows
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('Click Blue Button', async ({ page }) => {
    const buttons = page.locator('a.button, button.button');
    const firstButton = buttons.first();
    
    // Click button (should reload page)
    await firstButton.click();
    
    // Verify page is still functional
    await expect(page.locator('h3')).toHaveText('Challenging DOM');
  });

  test('Click Red Button', async ({ page }) => {
    const buttons = page.locator('a.button, button.button');
    const redButton = buttons.nth(1);
    
    // Click button
    await redButton.click();
    
    // Verify page is still functional
    await expect(page.locator('h3')).toHaveText('Challenging DOM');
  });

  test('Click Green Button', async ({ page }) => {
    const buttons = page.locator('a.button, button.button');
    const greenButton = buttons.nth(2);
    
    // Click button
    await greenButton.click();
    
    // Verify page is still functional
    await expect(page.locator('h3')).toHaveText('Challenging DOM');
  });

  test('Table Row Actions', async ({ page }) => {
    const table = page.locator('table');
    const firstRow = table.locator('tbody tr').first();
    const editLink = firstRow.locator('a[href^="#edit"]');
    const deleteLink = firstRow.locator('a[href^="#delete"]');
    
    // Verify action links exist
    await expect(editLink).toBeVisible();
    await expect(deleteLink).toBeVisible();
  });
});
