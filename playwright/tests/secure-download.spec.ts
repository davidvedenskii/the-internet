import { test, expect } from '@playwright/test';

test.describe('Secure File Download', () => {
  test('Successful Basic Auth and Download', async ({ browser }) => {
    // Create context with HTTP credentials
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/download_secure');
    
    // Verify page loaded with auth
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Secure File Downloader');
    
    await context.close();
  });

  test('File Links Present After Authentication', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/download_secure');
    
    // Verify download links exist
    const links = page.locator('.example a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    
    await context.close();
  });

  test('Download File After Authentication', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/download_secure');
    
    // Click first download link
    const firstLink = page.locator('.example a').first();
    const downloadPromise = page.waitForEvent('download');
    await firstLink.click();
    
    const download = await downloadPromise;
    expect(download).toBeTruthy();
    expect(download.suggestedFilename()).toBeTruthy();
    
    await context.close();
  });

  test('Failed Authentication', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'wrong',
        password: 'credentials'
      }
    });
    
    const page = await context.newPage();
    const response = await page.goto('/download_secure');
    
    // Should receive 401 Unauthorized
    expect(response?.status()).toBe(401);
    
    await context.close();
  });

  test('No Credentials Provided', async ({ page }) => {
    const response = await page.goto('/download_secure');
    
    // Should receive 401 Unauthorized
    expect(response?.status()).toBe(401);
  });
});
