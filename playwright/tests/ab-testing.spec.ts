import { test, expect } from '@playwright/test';

test.describe('A/B Testing Features', () => {
  test.describe('Basic A/B Test Page', () => {
    test('Page Load Verification', async ({ page }) => {
      // Navigate to the basic A/B test page
      await page.goto('/abtest');
      
      // Verify page loads successfully
      await expect(page).toHaveTitle('The Internet');
      
      // Verify heading
      const heading = page.locator('h3');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(/A\/B Test/);
      
      // Verify informational text
      const content = page.locator('#content');
      await expect(content).toBeVisible();
      await expect(content).toContainText('split testing');
    });

    test('Content Verification', async ({ page }) => {
      await page.goto('/abtest');
      
      // Verify explanation text
      const paragraph = page.locator('#content p');
      await expect(paragraph).toBeVisible();
      await expect(paragraph).toContainText('split testing');
      
      // Verify layout and formatting
      const contentDiv = page.locator('#content');
      await expect(contentDiv).toHaveCSS('display', 'block');
    });
  });

  test.describe('Cookie-based A/B Test', () => {
    test('Initial Page Load', async ({ page }) => {
      await page.goto('/abtest_cookies');
      
      // Verify initial state
      const heading = page.locator('h3');
      await expect(heading).toHaveText('A/B Test Cookies');
      
      // Verify link presence
      const link = page.getByRole('link', { name: 'Click here' });
      await expect(link).toBeVisible();
      await expect(link).toBeEnabled();
    });

    test('Cookie Implementation', async ({ page }) => {
      await page.goto('/abtest_cookies');
      
      // Store initial heading
      const initialHeading = await page.locator('h3').textContent();
      
      // Click the link to set cookie
      await page.getByRole('link', { name: 'Click here' }).click();
      
      // Wait for the page to reload after clicking
      await page.waitForLoadState('networkidle');
      
      // Verify heading has been updated
      const newHeading = await page.locator('h3').textContent();
      expect(newHeading).toBeDefined();
      expect(newHeading).toBe('A/B Test Cookies');
    });

    test('Cookie Persistence', async ({ page }) => {
      await page.goto('/abtest_cookies');
      
      // Set cookie
      await page.getByRole('link', { name: 'Click here' }).click();
      
      // Get initial cookie value
      const initialCookies = await page.context().cookies();
      const initialValue = initialCookies.find(cookie => cookie.name === 'ab_test_cookie')?.value;
      
      // Refresh page
      await page.reload();
      
      // Verify cookie persists
      const newCookies = await page.context().cookies();
      const newValue = newCookies.find(cookie => cookie.name === 'ab_test_cookie')?.value;
      expect(newValue).toBe(initialValue);
      
      // Navigate away and back
      await page.goto('/');
      await page.goto('/abtest_cookies');
      
      // Verify cookie still persists
      const finalCookies = await page.context().cookies();
      const finalValue = finalCookies.find(cookie => cookie.name === 'ab_test_cookie')?.value;
      expect(finalValue).toBe(initialValue);
    });
  });

  test.describe('Manual (JavaScript) A/B Test', () => {
    test('Initial Page State', async ({ page }) => {
      await page.goto('/abtest_manual');
      
      // Verify initial elements
      const heading = page.locator('h3');
      await expect(heading).toHaveText('A/B Test Manual');
      
      // Verify activation link
      const link = page.getByRole('link', { name: 'Click here' });
      await expect(link).toBeVisible();
      await expect(link).toBeEnabled();
    });

    test('JavaScript Activation', async ({ page }) => {
      await page.goto('/abtest_manual');
      
      // Start listening for console errors
      // Click activation link
      await page.getByRole('link', { name: 'Click here' }).click();
      
      // Wait for any page changes
      await page.waitForLoadState('networkidle');
      
      // Verify page has been updated
      await expect(page.locator('#content')).toBeVisible();
    });

    test('JavaScript State Persistence', async ({ page }) => {
      await page.goto('/abtest_manual');
      
      // Activate JavaScript test
      await page.getByRole('link', { name: 'Click here' }).click();
      
      // Store initial state
      const initialContent = await page.textContent('#content');
      
      // Refresh page
      await page.reload();
      
      // Verify state persistence
      const newContent = await page.textContent('#content');
      expect(newContent).toBe(initialContent);
      
      // Navigate away and back
      await page.goto('/');
      await page.goto('/abtest_manual');
      
      // Verify session state
      const finalContent = await page.textContent('#content');
      expect(finalContent).toBe(initialContent);
    });
  });
});