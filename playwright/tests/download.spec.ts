import { test, expect } from '@playwright/test';

test.describe('File Download', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/download');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('File Downloader');
    
    // Verify file list is visible
    const fileList = page.locator('.example');
    await expect(fileList).toBeVisible();
  });

  test('Download Links Are Present', async ({ page }) => {
    // Get all download links
    const downloadLinks = page.locator('.example a');
    
    // Verify at least one link exists
    const count = await downloadLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify links have href attributes
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(downloadLinks.nth(i)).toHaveAttribute('href', /.+/);
    }
  });

  test('Download File', async ({ page }) => {
    // Get first download link
    const firstLink = page.locator('.example a').first();
    
    // Start waiting for download
    const downloadPromise = page.waitForEvent('download');
    
    // Click download link
    await firstLink.click();
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toBeTruthy();
  });

  test('Multiple Downloads Available', async ({ page }) => {
    const downloadLinks = page.locator('.example a');
    const count = await downloadLinks.count();
    
    // Verify multiple files are available
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('File Names Visible', async ({ page }) => {
    const downloadLinks = page.locator('.example a');
    
    // Get text of first few links
    const count = Math.min(await downloadLinks.count(), 3);
    
    for (let i = 0; i < count; i++) {
      const linkText = await downloadLinks.nth(i).textContent();
      expect(linkText).toBeTruthy();
      expect(linkText?.length).toBeGreaterThan(0);
    }
  });
});
