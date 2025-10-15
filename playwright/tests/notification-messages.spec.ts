import { test, expect } from '@playwright/test';

test.describe('Notification Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notification_message');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Notification Message');
  });

  test('Click Here Link Present', async ({ page }) => {
    // Verify link exists
    const link = page.locator('a[href="/notification_message"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Click here');
  });

  test('Clicking Link Shows Notification', async ({ page }) => {
    // Click the link
    const link = page.locator('a[href="/notification_message"]');
    await link.click();
    
    // Wait for notification to appear
    const notification = page.locator('#flash');
    await expect(notification).toBeVisible();
  });

  test('Notification Contains Message', async ({ page }) => {
    // Click link
    await page.locator('a[href="/notification_message"]').click();
    
    // Get notification text
    const notification = page.locator('#flash');
    const text = await notification.textContent();
    
    // Should contain some message
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('Notification Can Be Closed', async ({ page }) => {
    // Click link to show notification
    await page.locator('a[href="/notification_message"]').click();
    
    // Wait for notification
    const notification = page.locator('#flash');
    await expect(notification).toBeVisible();
    
    // Click close button if it exists
    const closeButton = notification.locator('.close');
    if (await closeButton.count() > 0) {
      // Force click to bypass overlapping elements (e.g., GitHub fork banner on mobile)
      await closeButton.click({ force: true });
      await expect(notification).not.toBeVisible();
    }
  });

  test('Multiple Clicks Show Notifications', async ({ page }) => {
    const messages: string[] = [];
    
    // Click multiple times and collect messages
    for (let i = 0; i < 5; i++) {
      await page.locator('a[href="/notification_message"]').click();
      await page.waitForTimeout(500);
      
      const notification = page.locator('#flash');
      if (await notification.count() > 0) {
        const text = await notification.textContent();
        if (text) messages.push(text.trim());
      }
    }
    
    // Should have collected some messages
    expect(messages.length).toBeGreaterThan(0);
  });

  test('Notification Has Appropriate Styling', async ({ page }) => {
    // Click to show notification
    await page.locator('a[href="/notification_message"]').click();
    
    // Check notification classes
    const notification = page.locator('#flash');
    await expect(notification).toBeVisible();
    
    // Should have some class for styling (success, error, etc.)
    const classAttr = await notification.getAttribute('class');
    expect(classAttr).toBeTruthy();
  });
});
