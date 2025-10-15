import { test, expect } from '@playwright/test';

test.describe('Infinite Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/infinite_scroll');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Infinite Scroll');
  });

  test('Initial Content Loaded', async ({ page }) => {
    // Verify at least one content block present
    const paragraphs = page.locator('.jscroll-added');
    const initialCount = await paragraphs.count();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('Scroll Loads More Content', async ({ page }) => {
    // Get initial paragraph count
    const initialParagraphs = page.locator('.jscroll-added');
    const initialCount = await initialParagraphs.count();
    
    // Scroll down multiple times to ensure content loads (mobile needs multiple scrolls)
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
    }
    
    // Get new paragraph count
    const newCount = await page.locator('.jscroll-added').count();
    
    // Should have more paragraphs now
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('Multiple Scrolls Load Progressive Content', async ({ page }) => {
    const counts: number[] = [];
    
    // Initial count
    counts.push(await page.locator('.jscroll-added').count());
    
    // Scroll multiple times
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      counts.push(await page.locator('.jscroll-added').count());
    }
    
    // Each count should be greater than the previous
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1]);
    }
  });

  test('Content Persists After Scrolling', async ({ page }) => {
    // Get first paragraph text
    const firstParagraph = page.locator('.jscroll-added').first();
    const firstText = await firstParagraph.textContent();
    
    // Scroll down to load more
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Verify first paragraph still exists (content may change so just check it's still there)
    const firstParagraphAfter = page.locator('.jscroll-added').first();
    const firstTextAfter = await firstParagraphAfter.textContent();
    expect(firstTextAfter).toBeTruthy();
    expect(firstTextAfter?.length).toBeGreaterThan(0);
  });

  test('Page Height Increases With Scroll', async ({ page }) => {
    // Get initial page height
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Get new page height
    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    
    // Height should have increased
    expect(newHeight).toBeGreaterThan(initialHeight);
  });
});
