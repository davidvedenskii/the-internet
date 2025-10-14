import { test, expect } from '@playwright/test';

test.describe('Frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frames');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Frames');
    
    // Verify both frame links are present
    await expect(page.getByRole('link', { name: 'Nested Frames' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'iFrame' })).toBeVisible();
  });
});

test.describe('Nested Frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nested_frames');
  });

  test('Verify Frame Structure', async ({ page }) => {
    // Get all frames
    const frames = page.frames();
    
    // Should have multiple frames (main page + nested frames)
    expect(frames.length).toBeGreaterThan(1);
  });

  test('Top Frame Contains Three Frames', async ({ page }) => {
    // Get the top frame
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    
    // Verify left frame content
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
    await expect(leftFrame.locator('body')).toContainText('LEFT');
    
    // Verify middle frame content
    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
    await expect(middleFrame.locator('body')).toContainText('MIDDLE');
    
    // Verify right frame content
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
    await expect(rightFrame.locator('body')).toContainText('RIGHT');
  });

  test('Bottom Frame Content', async ({ page }) => {
    // Get the bottom frame
    const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
    
    // Verify content
    await expect(bottomFrame.locator('body')).toContainText('BOTTOM');
  });
});

test.describe('iFrame', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('An iFrame containing the TinyMCE WYSIWYG Editor');
  });

  test('iFrame Editor is Present', async ({ page }) => {
    // Get the iframe
    const iframe = page.locator('#mce_0_ifr');
    await expect(iframe).toBeVisible();
    
    // Verify editor element exists in iframe
    const editorFrame = page.frameLocator('#mce_0_ifr');
    const editor = editorFrame.locator('#tinymce');
    await expect(editor).toBeAttached();
  });

  test('Editor Has Content', async ({ page }) => {
    // Get the iframe
    const iframe = page.frameLocator('#mce_0_ifr');
    const editor = iframe.locator('#tinymce');
    
    // Verify editor has some content
    const content = await editor.textContent();
    expect(content).toBeTruthy();
  });
});
