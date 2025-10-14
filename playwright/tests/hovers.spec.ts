import { test, expect } from '@playwright/test';

test.describe('Hovers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hovers');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Hovers');
    
    // Verify all three figures are visible
    const figures = page.locator('.figure');
    await expect(figures).toHaveCount(3);
  });

  test('Hover Over First Figure', async ({ page }) => {
    const firstFigure = page.locator('.figure').nth(0);
    const caption = firstFigure.locator('.figcaption');
    
    // Caption should not be visible initially
    await expect(caption).not.toBeVisible();
    
    // Hover over the figure
    await firstFigure.hover();
    
    // Caption should become visible
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('name: user1');
    
    // Verify link is clickable
    const link = caption.locator('a');
    await expect(link).toHaveAttribute('href', '/users/1');
  });

  test('Hover Over Second Figure', async ({ page }) => {
    const secondFigure = page.locator('.figure').nth(1);
    const caption = secondFigure.locator('.figcaption');
    
    // Caption should not be visible initially
    await expect(caption).not.toBeVisible();
    
    // Hover over the figure
    await secondFigure.hover();
    
    // Caption should become visible
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('name: user2');
    
    // Verify link is clickable
    const link = caption.locator('a');
    await expect(link).toHaveAttribute('href', '/users/2');
  });

  test('Hover Over Third Figure', async ({ page }) => {
    const thirdFigure = page.locator('.figure').nth(2);
    const caption = thirdFigure.locator('.figcaption');
    
    // Caption should not be visible initially
    await expect(caption).not.toBeVisible();
    
    // Hover over the figure
    await thirdFigure.hover();
    
    // Caption should become visible
    await expect(caption).toBeVisible();
    await expect(caption).toContainText('name: user3');
    
    // Verify link is clickable
    const link = caption.locator('a');
    await expect(link).toHaveAttribute('href', '/users/3');
  });

  test('Hover Away Hides Caption', async ({ page }) => {
    const firstFigure = page.locator('.figure').nth(0);
    const caption = firstFigure.locator('.figcaption');
    
    // Hover over the figure
    await firstFigure.hover();
    await expect(caption).toBeVisible();
    
    // Move mouse away (hover over body)
    await page.locator('body').hover({ position: { x: 0, y: 0 } });
    
    // Caption should be hidden
    await expect(caption).not.toBeVisible();
  });

  test('All Images Are Loaded', async ({ page }) => {
    const images = page.locator('.figure img');
    await expect(images).toHaveCount(3);
    
    // Check all images have src attributes
    for (let i = 0; i < 3; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', /.+/);
    }
  });
});
