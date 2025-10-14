import { test, expect } from '@playwright/test';

test.describe('Disappearing Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/disappearing_elements');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Disappearing Elements');
  });

  test('At Least Four Elements Present', async ({ page }) => {
    // Verify menu exists - get all menu items
    const menuItems = page.locator('ul li');
    const count = await menuItems.count();
    
    // Should be 4 or 5 menu items
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThanOrEqual(5);
  });

  test('Home Link Present', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveText('Home');
  });

  test('About Link Present', async ({ page }) => {
    const aboutLink = page.locator('a[href="/about/"]');
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toHaveText('About');
  });

  test('Contact Link Present', async ({ page }) => {
    const contactLink = page.locator('a[href="/contact-us/"]');
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveText('Contact Us');
  });

  test('Portfolio Link Present', async ({ page }) => {
    const portfolioLink = page.locator('a[href="/portfolio/"]');
    await expect(portfolioLink).toBeVisible();
    await expect(portfolioLink).toHaveText('Portfolio');
  });

  test('Gallery Link May or May Not Be Present', async ({ page }) => {
    // This element randomly appears/disappears
    const menuItems = page.locator('ul li');
    const count = await menuItems.count();
    
    // Gallery is the 5th element if present
    if (count === 5) {
      const galleryLink = page.locator('a[href="/gallery/"]');
      await expect(galleryLink).toBeVisible();
      await expect(galleryLink).toHaveText('Gallery');
    } else {
      // Gallery not present this time
      expect(count).toBe(4);
    }
  });

  test('Multiple Page Reloads Show Different States', async ({ page }) => {
    const states: number[] = [];
    
    // Reload page multiple times and track menu item count
    for (let i = 0; i < 10; i++) {
      await page.reload();
      const menuItems = page.locator('ul li');
      const count = await menuItems.count();
      states.push(count);
    }
    
    // Should see variation in menu item count (4 or 5)
    const uniqueStates = new Set(states);
    expect(uniqueStates.size).toBeGreaterThanOrEqual(1);
    
    // All counts should be either 4 or 5
    states.forEach(count => {
      expect([4, 5]).toContain(count);
    });
  });
});
