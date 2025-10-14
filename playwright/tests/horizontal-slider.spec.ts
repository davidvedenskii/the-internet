import { test, expect } from '@playwright/test';

test.describe('Horizontal Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/horizontal_slider');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Horizontal Slider');
    
    // Verify slider is visible
    await expect(page.locator('input[type="range"]')).toBeVisible();
    
    // Verify range display
    await expect(page.locator('#range')).toBeVisible();
  });

  test('Initial Slider Value', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const rangeDisplay = page.locator('#range');
    
    // Initial value should be 0
    await expect(slider).toHaveValue('0');
    await expect(rangeDisplay).toHaveText('0');
  });

  test('Move Slider to Maximum', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const rangeDisplay = page.locator('#range');
    
    // Set slider to max value
    await slider.fill('5');
    
    // Verify value
    await expect(slider).toHaveValue('5');
    await expect(rangeDisplay).toHaveText('5');
  });

  test('Move Slider to Middle Value', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const rangeDisplay = page.locator('#range');
    
    // Set slider to middle value
    await slider.fill('2.5');
    
    // Verify value
    await expect(slider).toHaveValue('2.5');
    await expect(rangeDisplay).toHaveText('2.5');
  });

  test('Move Slider with Keyboard', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const rangeDisplay = page.locator('#range');
    
    // Focus on slider
    await slider.focus();
    
    // Press right arrow to increase
    await page.keyboard.press('ArrowRight');
    
    // Value should have increased
    const value = await rangeDisplay.textContent();
    expect(parseFloat(value || '0')).toBeGreaterThan(0);
  });

  test('Move Slider Incrementally', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    const rangeDisplay = page.locator('#range');
    
    // Test different values
    const testValues = ['0', '1', '2', '3', '4', '5'];
    
    for (const value of testValues) {
      await slider.fill(value);
      await expect(rangeDisplay).toHaveText(value);
    }
  });
});
