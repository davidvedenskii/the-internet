import { test, expect } from '@playwright/test';

test.describe('Checkboxes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkboxes');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Checkboxes');
  });

  test('Initial Checkbox States', async ({ page }) => {
    // Get all checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(2);
    
    // First checkbox should be unchecked
    await expect(checkboxes.nth(0)).not.toBeChecked();
    
    // Second checkbox should be checked
    await expect(checkboxes.nth(1)).toBeChecked();
  });

  test('Toggle First Checkbox', async ({ page }) => {
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    
    // Initially unchecked
    await expect(firstCheckbox).not.toBeChecked();
    
    // Click to check
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    
    // Click to uncheck
    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();
  });

  test('Toggle Second Checkbox', async ({ page }) => {
    const secondCheckbox = page.locator('input[type="checkbox"]').nth(1);
    
    // Initially checked
    await expect(secondCheckbox).toBeChecked();
    
    // Click to uncheck
    await secondCheckbox.uncheck();
    await expect(secondCheckbox).not.toBeChecked();
    
    // Click to check
    await secondCheckbox.check();
    await expect(secondCheckbox).toBeChecked();
  });

  test('Multiple Checkbox Interactions', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    
    // Check both
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();
    
    // Uncheck both
    await checkboxes.nth(0).uncheck();
    await checkboxes.nth(1).uncheck();
    await expect(checkboxes.nth(0)).not.toBeChecked();
    await expect(checkboxes.nth(1)).not.toBeChecked();
  });
});
