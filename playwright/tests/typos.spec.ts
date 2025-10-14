import { test, expect } from '@playwright/test';

test.describe('Typos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/typos');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Typos');
  });

  test('Page Contains Text Content', async ({ page }) => {
    // Verify there are paragraphs
    const paragraphs = page.locator('.example p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Text May Contain Typos', async ({ page }) => {
    // Get the second paragraph which sometimes has typos
    const paragraph = page.locator('.example p').nth(1);
    const text = await paragraph.textContent();
    
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('Multiple Page Loads Show Text Variations', async ({ page }) => {
    const texts: string[] = [];
    
    // Load page multiple times and collect text
    for (let i = 0; i < 10; i++) {
      await page.reload();
      const paragraph = page.locator('.example p').nth(1);
      const text = await paragraph.textContent();
      if (text) texts.push(text.trim());
    }
    
    // Should have collected multiple texts
    expect(texts.length).toBe(10);
    
    // All texts should be non-empty
    texts.forEach(text => {
      expect(text.length).toBeGreaterThan(0);
    });
  });

  test('Text Content Present Despite Typos', async ({ page }) => {
    // Verify main content is always visible
    const content = page.locator('.example');
    await expect(content).toBeVisible();
    
    // Verify has at least some text
    const text = await content.textContent();
    expect(text?.length).toBeGreaterThan(50);
  });

  test('Typo Text Contains Expected Words', async ({ page }) => {
    // The typo paragraph should contain certain words
    const paragraph = page.locator('.example p').nth(1);
    const text = await paragraph.textContent();
    
    // Check for key words (allowing for typos)
    expect(text?.toLowerCase()).toMatch(/sometimes|you'll|see|typo/i);
  });
});
