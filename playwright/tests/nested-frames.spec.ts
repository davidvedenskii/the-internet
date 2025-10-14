import { test, expect } from '@playwright/test';

test.describe('Nested Frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nested_frames');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page has frames
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    await expect(topFrame.locator('frame[name="frame-left"]')).toBeAttached();
  });

  test('Top Frame Present', async ({ page }) => {
    const topFrame = page.frame({ name: 'frame-top' });
    expect(topFrame).toBeTruthy();
  });

  test('Bottom Frame Present', async ({ page }) => {
    const bottomFrame = page.frame({ name: 'frame-bottom' });
    expect(bottomFrame).toBeTruthy();
  });

  test('Left Frame Content', async ({ page }) => {
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
    const body = leftFrame.locator('body');
    
    await expect(body).toContainText('LEFT');
  });

  test('Middle Frame Content', async ({ page }) => {
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
    const body = middleFrame.locator('body');
    
    await expect(body).toContainText('MIDDLE');
  });

  test('Right Frame Content', async ({ page }) => {
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
    const body = rightFrame.locator('body');
    
    await expect(body).toContainText('RIGHT');
  });

  test('Bottom Frame Content', async ({ page }) => {
    const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
    const body = bottomFrame.locator('body');
    
    await expect(body).toContainText('BOTTOM');
  });

  test('All Nested Frames Accessible', async ({ page }) => {
    // Access all frames through frameLocator
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
    const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
    
    // Verify all are accessible
    await expect(leftFrame.locator('body')).toBeVisible();
    await expect(middleFrame.locator('body')).toBeVisible();
    await expect(rightFrame.locator('body')).toBeVisible();
    await expect(bottomFrame.locator('body')).toBeVisible();
  });
});
