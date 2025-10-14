import { test, expect } from '@playwright/test';

test.describe('Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inputs');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Inputs');
    
    // Verify input field is visible
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('Enter Positive Number', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Enter a positive number
    await input.fill('123');
    
    // Verify value
    await expect(input).toHaveValue('123');
  });

  test('Enter Negative Number', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Enter a negative number
    await input.fill('-456');
    
    // Verify value
    await expect(input).toHaveValue('-456');
  });

  test('Enter Decimal Number', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Enter a decimal number
    await input.fill('12.34');
    
    // Verify value
    await expect(input).toHaveValue('12.34');
  });

  test('Enter Zero', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Enter zero
    await input.fill('0');
    
    // Verify value
    await expect(input).toHaveValue('0');
  });

  test('Increment with Arrow Up', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Set initial value
    await input.fill('5');
    await expect(input).toHaveValue('5');
    
    // Focus and press arrow up
    await input.focus();
    await page.keyboard.press('ArrowUp');
    
    // Value should increase
    await expect(input).toHaveValue('6');
  });

  test('Decrement with Arrow Down', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Set initial value
    await input.fill('5');
    await expect(input).toHaveValue('5');
    
    // Focus and press arrow down
    await input.focus();
    await page.keyboard.press('ArrowDown');
    
    // Value should decrease
    await expect(input).toHaveValue('4');
  });

  test('Clear Input Field', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    
    // Enter a value
    await input.fill('999');
    await expect(input).toHaveValue('999');
    
    // Clear the field
    await input.clear();
    
    // Verify empty
    await expect(input).toHaveValue('');
  });
});
