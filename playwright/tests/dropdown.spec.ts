import { test, expect } from '@playwright/test';

test.describe('Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dropdown');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Dropdown List');
    
    // Verify dropdown is visible
    const dropdown = page.locator('#dropdown');
    await expect(dropdown).toBeVisible();
  });

  test('Dropdown Initial State', async ({ page }) => {
    const dropdown = page.locator('#dropdown');
    
    // Verify default selection
    await expect(dropdown).toHaveValue('');
    
    // Verify placeholder text
    const selectedOption = dropdown.locator('option[selected]');
    await expect(selectedOption).toHaveText('Please select an option');
  });

  test('Select Option 1', async ({ page }) => {
    const dropdown = page.locator('#dropdown');
    
    // Select option 1
    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
    
    // Verify selected text
    const selectedText = await dropdown.locator('option[selected]').textContent();
    expect(selectedText).toBe('Option 1');
  });

  test('Select Option 2', async ({ page }) => {
    const dropdown = page.locator('#dropdown');
    
    // Select option 2
    await dropdown.selectOption('2');
    await expect(dropdown).toHaveValue('2');
    
    // Verify selected text
    const selectedText = await dropdown.locator('option[selected]').textContent();
    expect(selectedText).toBe('Option 2');
  });

  test('Switch Between Options', async ({ page }) => {
    const dropdown = page.locator('#dropdown');
    
    // Select option 1
    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
    
    // Switch to option 2
    await dropdown.selectOption('2');
    await expect(dropdown).toHaveValue('2');
    
    // Switch back to option 1
    await dropdown.selectOption('1');
    await expect(dropdown).toHaveValue('1');
  });

  test('Dropdown Options Count', async ({ page }) => {
    const dropdown = page.locator('#dropdown');
    const options = dropdown.locator('option');
    
    // Should have 3 options (placeholder + 2 options)
    await expect(options).toHaveCount(3);
  });
});
