import { test, expect, Browser } from '@playwright/test';

test.describe('Basic Authentication', () => {
  // Helper function to create authenticated context
  async function createAuthenticatedContext(browser: Browser, username: string, password: string) {
    const context = await browser.newContext({
      httpCredentials: {
        username,
        password,
      },
    });
    return context;
  }

  test('Authentication Success', async ({ browser }) => {
    const context = await createAuthenticatedContext(browser, 'admin', 'admin');
    const page = await context.newPage();
    
    await page.goto('/basic_auth');
    
    // Verify successful authentication
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Basic Auth');
    
    // Verify success message
    const content = page.locator('.example p');
    await expect(content).toContainText('Congratulations');
    
    await context.close();
  });

  test('Authentication Failure', async ({ browser }) => {
    const context = await createAuthenticatedContext(browser, 'invalid', 'invalid');
    const page = await context.newPage();
    
    // Attempt to access the page (should fail)
    const response = await page.goto('/basic_auth');
    expect(response?.status()).toBe(401);
    
    await context.close();
  });

  test('Session Persistence', async ({ browser }) => {
    const context = await createAuthenticatedContext(browser, 'admin', 'admin');
    const page = await context.newPage();
    
    // First access
    await page.goto('/basic_auth');
    await expect(page.locator('h3')).toHaveText('Basic Auth');
    
    // Navigate away
    await page.goto('/');
    
    // Return to auth page
    await page.goto('/basic_auth');
    await expect(page.locator('h3')).toHaveText('Basic Auth');
    
    await context.close();
  });

  test('Direct Access Without Credentials', async ({ page }) => {
    // Attempt to access without credentials
    const response = await page.goto('/basic_auth');
    expect(response?.status()).toBe(401);
  });
});