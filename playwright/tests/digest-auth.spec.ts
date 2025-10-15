import { test, expect } from '@playwright/test';

test.describe('Digest Authentication', () => {
  test('Successful Digest Authentication', async ({ browser }) => {
    // Create context with HTTP credentials
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    
    const page = await context.newPage();
    await page.goto('/digest_auth');
    
    // Verify successful authentication message
    const successMessage = page.locator('.example p');
    await expect(successMessage).toContainText('Congratulations! You must have the proper credentials.');
    
    await context.close();
  });

  test('Failed Digest Authentication - Wrong Username', async ({ browser, browserName }) => {
    // Skip in Firefox - it handles digest auth differently (NS_ERROR_NET_EMPTY_RESPONSE)
    test.skip(browserName === 'firefox', 'Firefox closes connection instead of returning 401');
    
    const context = await browser.newContext({
      httpCredentials: {
        username: 'wronguser',
        password: 'admin'
      }
    });
    
    const page = await context.newPage();
    const response = await page.goto('/digest_auth');
    
    // Should receive 401 Unauthorized
    expect(response?.status()).toBe(401);
    
    await context.close();
  });

  test('Failed Digest Authentication - Wrong Password', async ({ browser, browserName }) => {
    // Skip in Firefox - it handles digest auth differently (NS_ERROR_NET_EMPTY_RESPONSE)
    test.skip(browserName === 'firefox', 'Firefox closes connection instead of returning 401');
    
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'wrongpass'
      }
    });
    
    const page = await context.newPage();
    const response = await page.goto('/digest_auth');
    
    // Should receive 401 Unauthorized
    expect(response?.status()).toBe(401);
    
    await context.close();
  });

  test('No Credentials Provided', async ({ page, browserName }) => {
    // Skip in Firefox - it handles digest auth differently (NS_ERROR_NET_EMPTY_RESPONSE)
    test.skip(browserName === 'firefox', 'Firefox closes connection instead of returning 401');
    
    // Navigate without credentials
    const response = await page.goto('/digest_auth');
    
    // Should receive 401 Unauthorized
    expect(response?.status()).toBe(401);
  });
});
