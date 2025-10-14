import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h2');
    await expect(heading).toHaveText('Login Page');
    
    // Verify form elements
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Successful Login', async ({ page }) => {
    // Enter valid credentials
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Verify successful login
    await expect(page).toHaveURL(/\/secure/);
    
    // Verify success message
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('You logged into a secure area!');
    
    // Verify logout button is visible
    await expect(page.locator('.button.secondary')).toBeVisible();
  });

  test('Login with Invalid Username', async ({ page }) => {
    // Enter invalid credentials
    await page.fill('#username', 'invaliduser');
    await page.fill('#password', 'SuperSecretPassword!');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Verify error message
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('Your username is invalid!');
    
    // Verify still on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('Login with Invalid Password', async ({ page }) => {
    // Enter invalid password
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'wrongpassword');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Verify error message
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('Your password is invalid!');
    
    // Verify still on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('Login with Empty Fields', async ({ page }) => {
    // Click login without entering credentials
    await page.click('button[type="submit"]');
    
    // Verify error message
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('Your username is invalid!');
  });

  test('Logout After Successful Login', async ({ page }) => {
    // Login first
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    
    // Verify logged in
    await expect(page).toHaveURL(/\/secure/);
    
    // Click logout
    await page.click('.button.secondary');
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/\/login/);
    
    // Verify logout message
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('You logged out of the secure area!');
  });
});
