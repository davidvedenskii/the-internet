import { test, expect } from '@playwright/test';

test.describe('Dynamic Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dynamic_controls');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h4');
    await expect(heading.first()).toHaveText('Dynamic Controls');
  });

  test('Remove Checkbox', async ({ page }) => {
    const checkbox = page.locator('#checkbox');
    const toggleButton = page.locator('#checkbox-example button');
    
    // Verify checkbox is initially visible
    await expect(checkbox).toBeVisible();
    
    // Click remove button
    await toggleButton.click();
    
    // Wait for loading to complete
    await expect(page.locator('#checkbox-example #loading')).toBeHidden({ timeout: 10000 });
    
    // Verify checkbox is gone
    await expect(checkbox).not.toBeVisible();
    
    // Verify message
    const message = page.locator('#checkbox-example #message');
    await expect(message).toHaveText("It's gone!");
    
    // Verify button text changed to Add
    await expect(toggleButton).toHaveText('Add');
  });

  test('Add Checkbox Back', async ({ page }) => {
    const checkbox = page.locator('#checkbox');
    const toggleButton = page.locator('#checkbox-example button');
    
    // First remove the checkbox
    await toggleButton.click();
    await page.waitForSelector('#checkbox-example #loading', { state: 'hidden', timeout: 10000 });
    await expect(checkbox).not.toBeVisible();
    
    // Now add it back
    await toggleButton.click();
    await page.waitForSelector('#checkbox-example #loading', { state: 'hidden', timeout: 10000 });
    
    // Verify checkbox is visible again
    await expect(checkbox).toBeVisible();
    
    // Verify message
    const message = page.locator('#checkbox-example #message');
    await expect(message).toHaveText("It's back!");
  });

  test('Enable Input Field', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const enableButton = page.locator('#input-example button');
    
    // Verify input is initially disabled
    await expect(input).toBeDisabled();
    
    // Click enable button
    await enableButton.click();
    
    // Wait for loading to complete
    await expect(page.locator('#loading')).toBeHidden({ timeout: 10000 });
    
    // Verify input is now enabled
    await expect(input).toBeEnabled();
    
    // Verify message
    const message = page.locator('#input-example #message');
    await expect(message).toHaveText("It's enabled!");
    
    // Verify we can type in the input
    await input.fill('Test input');
    await expect(input).toHaveValue('Test input');
    
    // Verify button text changed to Disable
    await expect(enableButton).toHaveText('Disable');
  });

  test('Disable Input Field', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const toggleButton = page.locator('#input-example button');
    
    // First enable the input
    await toggleButton.click();
    await page.waitForSelector('#input-example #loading', { state: 'hidden', timeout: 10000 });
    await expect(input).toBeEnabled();
    
    // Type some text
    await input.fill('Test text');
    
    // Now disable it
    await toggleButton.click();
    await page.waitForSelector('#input-example #loading', { state: 'hidden', timeout: 10000 });
    
    // Verify input is disabled
    await expect(input).toBeDisabled();
    
    // Verify message
    const message = page.locator('#input-example #message');
    await expect(message).toHaveText("It's disabled!");
    
    // Verify the text persists
    await expect(input).toHaveValue('Test text');
  });
});
