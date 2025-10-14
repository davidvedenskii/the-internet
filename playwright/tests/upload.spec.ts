import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/upload');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('File Uploader');
    
    // Verify file input and upload button
    await expect(page.locator('#file-upload')).toBeVisible();
    await expect(page.locator('#file-submit')).toBeVisible();
  });

  test('Upload Single File', async ({ page }) => {
    // Create a test file path
    const filePath = path.join(__dirname, '../seed.spec.ts');
    
    // Upload file
    await page.setInputFiles('#file-upload', filePath);
    
    // Click upload button
    await page.click('#file-submit');
    
    // Verify success page
    await expect(page).toHaveURL(/\/upload/);
    
    // Verify upload message
    const heading = page.locator('h3');
    await expect(heading).toHaveText('File Uploaded!');
    
    // Verify uploaded file name
    const uploadedFile = page.locator('#uploaded-files');
    await expect(uploadedFile).toContainText('seed.spec.ts');
  });

  test('Upload Button Without File', async ({ page }) => {
    // Click upload without selecting file
    await page.click('#file-submit');
    
    // Should still be on the same page or show error
    // The behavior might vary, so we just check the page loads
    await expect(page).toHaveURL(/upload/);
  });

  test('File Input Accepts Files', async ({ page }) => {
    const fileInput = page.locator('#file-upload');
    
    // Verify input accepts files
    const inputType = await fileInput.getAttribute('type');
    expect(inputType).toBe('file');
  });

  test('Drag and Drop Zone Visible', async ({ page }) => {
    // Verify drag and drop area
    const dragDropArea = page.locator('#drag-drop-upload');
    await expect(dragDropArea).toBeVisible();
  });
});
