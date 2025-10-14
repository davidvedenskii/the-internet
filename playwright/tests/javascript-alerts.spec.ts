import { test, expect } from '@playwright/test';

test.describe('JavaScript Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/javascript_alerts');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('JavaScript Alerts');
    
    // Verify all three buttons are visible
    await expect(page.getByRole('button', { name: 'Click for JS Alert' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Click for JS Confirm' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Click for JS Prompt' })).toBeVisible();
  });

  test('JS Alert - Accept', async ({ page }) => {
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });
    
    // Click the alert button
    await page.click('button[onclick="jsAlert()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText('You successfully clicked an alert');
  });

  test('JS Confirm - Accept', async ({ page }) => {
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.accept();
    });
    
    // Click the confirm button
    await page.click('button[onclick="jsConfirm()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText('You clicked: Ok');
  });

  test('JS Confirm - Dismiss', async ({ page }) => {
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.dismiss();
    });
    
    // Click the confirm button
    await page.click('button[onclick="jsConfirm()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText('You clicked: Cancel');
  });

  test('JS Prompt - Accept with Text', async ({ page }) => {
    const testText = 'Hello Playwright';
    
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('I am a JS prompt');
      await dialog.accept(testText);
    });
    
    // Click the prompt button
    await page.click('button[onclick="jsPrompt()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText(`You entered: ${testText}`);
  });

  test('JS Prompt - Dismiss', async ({ page }) => {
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('I am a JS prompt');
      await dialog.dismiss();
    });
    
    // Click the prompt button
    await page.click('button[onclick="jsPrompt()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText('You entered: null');
  });

  test('JS Prompt - Empty Input', async ({ page }) => {
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('');
    });
    
    // Click the prompt button
    await page.click('button[onclick="jsPrompt()"]');
    
    // Verify result message
    const result = page.locator('#result');
    await expect(result).toHaveText('You entered: ');
  });
});
