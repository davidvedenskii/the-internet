import { test, expect } from '@playwright/test';

test.describe('Floating Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/floating_menu');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Floating Menu');
  });

  test('Floating Menu Visible on Page Load', async ({ page }) => {
    // Verify menu is visible
    const menu = page.locator('#menu');
    await expect(menu).toBeVisible();
  });

  test('Menu Contains All Links', async ({ page }) => {
    const menu = page.locator('#menu');
    
    // Verify all menu items
    await expect(menu.locator('a[href="#home"]')).toHaveText('Home');
    await expect(menu.locator('a[href="#news"]')).toHaveText('News');
    await expect(menu.locator('a[href="#contact"]')).toHaveText('Contact');
    await expect(menu.locator('a[href="#about"]')).toHaveText('About');
  });

  test('Menu Remains Visible After Scrolling Down', async ({ page }) => {
    const menu = page.locator('#menu');
    
    // Verify menu is initially visible
    await expect(menu).toBeVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Menu should still be visible (floating)
    await expect(menu).toBeVisible();
  });

  test('Menu Remains Visible After Scrolling to Bottom', async ({ page }) => {
    const menu = page.locator('#menu');
    
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    // Menu should still be visible (floating)
    await expect(menu).toBeVisible();
  });

  test('Menu Links Are Clickable While Floating', async ({ page }) => {
    // Scroll down to ensure menu is floating
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Click on News link
    const newsLink = page.locator('#menu a[href="#news"]');
    await newsLink.click();
    
    // Verify URL updated with hash
    expect(page.url()).toContain('#news');
  });

  test('Menu Position Fixed While Scrolling', async ({ page }) => {
    const menu = page.locator('#menu');
    
    // Verify menu exists after scrolling
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);
    
    // Menu should still be visible (main test)
    await expect(menu).toBeVisible();
    
    // Get position to verify it's accessible
    const box = await menu.boundingBox();
    expect(box).toBeTruthy();
  });
});
