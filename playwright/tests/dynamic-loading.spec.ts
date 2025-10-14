import { test, expect } from '@playwright/test';

test.describe('Dynamic Loading', () => {
  test.describe('Example 1: Hidden Element', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dynamic_loading/1');
    });

    test('Page Load Verification', async ({ page }) => {
      // Verify page title
      await expect(page).toHaveTitle('The Internet');
      
      // Verify heading
      const heading = page.locator('h3');
      await expect(heading).toContainText('Dynamically Loaded Page Elements');
      
      // Verify start button
      await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
    });

    test('Element Hidden Initially', async ({ page }) => {
      const finishText = page.locator('#finish');
      
      // Element exists but is hidden
      await expect(finishText).toBeHidden();
    });

    test('Click Start Reveals Element', async ({ page }) => {
      const startButton = page.getByRole('button', { name: 'Start' });
      const finishText = page.locator('#finish');
      const loading = page.locator('#loading');
      
      // Click start button
      await startButton.click();
      
      // Loading indicator should appear
      await expect(loading).toBeVisible();
      
      // Wait for loading to complete
      await expect(loading).toBeHidden({ timeout: 10000 });
      
      // Finish text should be visible
      await expect(finishText).toBeVisible();
      await expect(finishText).toHaveText('Hello World!');
    });
  });

  test.describe('Example 2: Rendered Element', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dynamic_loading/2');
    });

    test('Page Load Verification', async ({ page }) => {
      // Verify page title
      await expect(page).toHaveTitle('The Internet');
      
      // Verify heading
      const heading = page.locator('h3');
      await expect(heading).toContainText('Dynamically Loaded Page Elements');
      
      // Verify start button
      await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
    });

    test('Element Not Present Initially', async ({ page }) => {
      const finishText = page.locator('#finish');
      
      // Element should not be attached to DOM
      await expect(finishText).toHaveCount(0);
    });

    test('Click Start Renders Element', async ({ page }) => {
      const startButton = page.getByRole('button', { name: 'Start' });
      const finishText = page.locator('#finish');
      const loading = page.locator('#loading');
      
      // Click start button
      await startButton.click();
      
      // Loading indicator should appear
      await expect(loading).toBeVisible();
      
      // Wait for loading to complete
      await expect(loading).toBeHidden({ timeout: 10000 });
      
      // Finish text should be rendered and visible
      await expect(finishText).toBeVisible();
      await expect(finishText).toHaveText('Hello World!');
    });

    test('Loading Indicator Timing', async ({ page }) => {
      const startButton = page.getByRole('button', { name: 'Start' });
      const loading = page.locator('#loading');
      
      // Click start
      await startButton.click();
      
      // Verify loading appears immediately
      await expect(loading).toBeVisible({ timeout: 1000 });
      
      // Verify loading eventually disappears
      await expect(loading).toBeHidden({ timeout: 10000 });
    });
  });
});
