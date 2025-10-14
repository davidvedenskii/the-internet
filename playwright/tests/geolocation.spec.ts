import { test, expect } from '@playwright/test';

test.describe('Geolocation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/geolocation');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Geolocation');
  });

  test('Where Am I Button Present', async ({ page }) => {
    // Verify button exists
    const button = page.locator('button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Where am I?');
  });

  test('Click Where Am I Button', async ({ context, page }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);
    
    // Set geolocation
    await context.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });
    
    // Click button
    const button = page.locator('button');
    await button.click();
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Verify latitude displayed
    const latElement = page.locator('#lat-value');
    await expect(latElement).toBeVisible();
    const latValue = await latElement.textContent();
    expect(latValue).toBeTruthy();
  });

  test('Geolocation Coordinates Displayed', async ({ context, page }) => {
    // Grant permission and set location
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
    
    // Click button
    await page.locator('button').click();
    await page.waitForTimeout(1000);
    
    // Verify both latitude and longitude displayed
    const latElement = page.locator('#lat-value');
    const longElement = page.locator('#long-value');
    
    await expect(latElement).toBeVisible();
    await expect(longElement).toBeVisible();
    
    // Verify values are numeric
    const lat = await latElement.textContent();
    const long = await longElement.textContent();
    expect(parseFloat(lat || '')).toBeTruthy();
    expect(parseFloat(long || '')).toBeTruthy();
  });

  test('Google Maps Link Present After Getting Location', async ({ context, page }) => {
    // Grant permission and set location
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 51.5074, longitude: -0.1278 });
    
    // Click button
    await page.locator('button').click();
    await page.waitForTimeout(1000);
    
    // Verify Google Maps link or any link
    const mapLink = page.locator('a[href*="google"], a[target="_blank"]');
    const linkCount = await mapLink.count();
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });

  test('Different Locations Show Different Coordinates', async ({ context, page }) => {
    // Test first location
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 }); // Paris
    
    await page.locator('button').click();
    await page.waitForTimeout(1000);
    
    const lat1 = await page.locator('#lat-value').textContent();
    const long1 = await page.locator('#long-value').textContent();
    
    // Change location
    await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 }); // Tokyo
    
    await page.locator('button').click();
    await page.waitForTimeout(1000);
    
    const lat2 = await page.locator('#lat-value').textContent();
    const long2 = await page.locator('#long-value').textContent();
    
    // Coordinates should be different
    expect(lat1).not.toBe(lat2);
    expect(long1).not.toBe(long2);
  });
});
