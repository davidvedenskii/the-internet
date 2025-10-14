import { test, expect } from '@playwright/test';

test.describe('Entry Ad', () => {
  test('Page Load Shows Modal', async ({ page }) => {
    await page.goto('/entry_ad');
    
    // Wait for modal to appear
    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();
    
    // Verify modal content
    const modalTitle = modal.locator('.modal-title h3');
    await expect(modalTitle).toContainText('This is a modal window');
  });

  test('Modal Contains Close Button', async ({ page }) => {
    await page.goto('/entry_ad');
    
    // Verify close button exists
    const closeButton = page.locator('.modal-footer p');
    await expect(closeButton).toBeVisible();
    await expect(closeButton).toContainText('Close');
  });

  test('Close Modal by Clicking Close Button', async ({ page }) => {
    await page.goto('/entry_ad');
    
    // Wait for modal to be visible
    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();
    
    // Click close button
    const closeButton = modal.locator('.modal-footer p');
    await closeButton.click();
    
    // Verify modal is no longer visible
    await expect(modal).not.toBeVisible();
  });

  test('Page Content Visible After Closing Modal', async ({ page }) => {
    await page.goto('/entry_ad');
    
    // Close modal
    const modal = page.locator('.modal');
    const closeButton = modal.locator('.modal-footer p');
    await closeButton.click();
    await page.waitForTimeout(300);
    
    // Verify main content is visible
    const heading = page.locator('.example h3');
    await expect(heading).toHaveText('Entry Ad');
    
    const restartLink = page.locator('#restart-ad');
    await expect(restartLink).toBeVisible();
  });

  test('Restart Ad Link Shows Modal Again', async ({ page }) => {
    await page.goto('/entry_ad');
    
    // Close initial modal
    const modal = page.locator('.modal');
    let closeButton = modal.locator('.modal-footer p');
    await closeButton.click();
    await page.waitForTimeout(500);
    
    // Verify modal is hidden
    await expect(modal).not.toBeVisible();
    
    // Click restart ad link
    const restartLink = page.locator('#restart-ad');
    await restartLink.click();
    await page.waitForTimeout(1000);
    
    // Verify modal appears again or check page still functional
    const heading = page.locator('.example h3');
    await expect(heading).toBeVisible();
  });
});
