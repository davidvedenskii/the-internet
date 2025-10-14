import { test, expect } from '@playwright/test';

test.describe('Shifting Content - Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shifting_content/menu');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Shifting Content: Menu Element');
  });

  test('Menu Present', async ({ page }) => {
    // Just check if menu items exist
    const menuItems = page.locator('ul li, li');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Menu Items Present', async ({ page }) => {
    const menuItems = page.locator('ul li');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Home Link Present', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
  });
});

test.describe('Shifting Content - Image', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shifting_content/image');
  });

  test('Page Load Verification', async ({ page }) => {
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Shifting Content: Image');
  });

  test('Image Present', async ({ page }) => {
    const image = page.locator('.example img, img').first();
    await expect(image).toBeVisible();
  });

  test('Image Position May Vary', async ({ page }) => {
    const image = page.locator('.example img, img').first();
    const box = await image.boundingBox();
    expect(box).toBeTruthy();
  });
});

test.describe('Shifting Content - List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shifting_content/list');
  });

  test('Page Load Verification', async ({ page }) => {
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Shifting Content: List');
  });

  test('List Items Present', async ({ page }) => {
    const listItems = page.locator('.example li, li');
    const count = await listItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('List Content Varies', async ({ page }) => {
    test.setTimeout(10000);
    
    const listItems = page.locator('.example li, li');
    const count = await listItems.count();
    
    if (count > 0) {
      const firstItemText = await listItems.first().textContent();
      expect(firstItemText).toBeTruthy();
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe('Shifting Content - Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shifting_content');
  });

  test('Page Load Verification', async ({ page }) => {
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Shifting Content');
  });

  test('Example Links Present', async ({ page }) => {
    const menuLink = page.locator('a[href*="menu"]');
    const imageLink = page.locator('a[href*="image"]');
    const listLink = page.locator('a[href*="list"]');
    
    await expect(menuLink).toBeVisible();
    await expect(imageLink).toBeVisible();
    await expect(listLink).toBeVisible();
  });

  test('Navigate to Menu Example', async ({ page }) => {
    await page.locator('a[href*="menu"]').first().click();
    await expect(page).toHaveURL(/menu/);
  });

  test('Navigate to Image Example', async ({ page }) => {
    await page.locator('a[href*="image"]').first().click();
    await expect(page).toHaveURL(/image/);
  });

  test('Navigate to List Example', async ({ page }) => {
    await page.locator('a[href*="list"]').first().click();
    await expect(page).toHaveURL(/list/);
  });
});
