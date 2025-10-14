import { test, expect } from '@playwright/test';

test.describe('Context Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/context_menu');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Context Menu');
    
    // Verify hot spot is visible
    await expect(page.locator('#hot-spot')).toBeVisible();
  });

  test('Right Click Shows Alert', async ({ page }) => {
    const hotSpot = page.locator('#hot-spot');
    
    // Set up dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You selected a context menu');
      await dialog.accept();
    });
    
    // Right click on the hot spot
    await hotSpot.click({ button: 'right' });
  });

  test('Left Click Does Not Show Alert', async ({ page }) => {
    const hotSpot = page.locator('#hot-spot');
    
    // Set up dialog handler (should not be called)
    let dialogShown = false;
    page.once('dialog', async () => {
      dialogShown = true;
    });
    
    // Left click on the hot spot
    await hotSpot.click({ button: 'left' });
    
    // Wait a bit to ensure no dialog
    await page.waitForTimeout(500);
    
    expect(dialogShown).toBe(false);
  });
});
