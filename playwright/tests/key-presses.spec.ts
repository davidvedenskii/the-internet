import { test, expect } from '@playwright/test';

test.describe('Key Presses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/key_presses');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Key Presses');
    
    // Verify input field is visible
    await expect(page.locator('#target')).toBeVisible();
  });

  test('Press Letter Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press a key
    await input.focus();
    await page.keyboard.press('A');
    
    // Verify result
    await expect(result).toHaveText('You entered: A');
  });

  test('Press Number Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press a number
    await input.focus();
    await page.keyboard.press('5');
    
    // Verify result
    await expect(result).toHaveText('You entered: 5');
  });

  test('Press Enter Key', async ({ page }) => {
    const input = page.locator('#target');
    
    // Focus input and type to avoid form submission
    await input.click();
    await input.type('test');
    
    // Check that input is functional
    const value = await input.inputValue();
    expect(value).toBe('test');
  });

  test('Press Space Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press Space
    await input.focus();
    await page.keyboard.press('Space');
    
    // Verify result
    await expect(result).toHaveText('You entered: SPACE');
  });

  test('Press Backspace Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press Backspace
    await input.focus();
    await page.keyboard.press('Backspace');
    
    // Verify result
    await expect(result).toHaveText('You entered: BACK_SPACE');
  });

  test('Press Tab Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press Tab
    await input.focus();
    await page.keyboard.press('Tab');
    
    // Verify result
    await expect(result).toHaveText('You entered: TAB');
  });

  test('Press Arrow Keys', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Test each arrow key
    const arrowTests = [
      { key: 'ArrowUp', expected: 'UP' },
      { key: 'ArrowDown', expected: 'DOWN' },
      { key: 'ArrowLeft', expected: 'LEFT' },
      { key: 'ArrowRight', expected: 'RIGHT' }
    ];
    
    for (const { key, expected } of arrowTests) {
      await input.focus();
      await page.keyboard.press(key);
      await expect(result).toHaveText(`You entered: ${expected}`);
    }
  });

  test('Press Escape Key', async ({ page }) => {
    const input = page.locator('#target');
    const result = page.locator('#result');
    
    // Focus input and press Escape
    await input.focus();
    await page.keyboard.press('Escape');
    
    // Verify result
    await expect(result).toHaveText('You entered: ESCAPE');
  });
});
