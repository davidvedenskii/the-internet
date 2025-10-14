import { test, expect } from '@playwright/test';

test.describe('Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/drag_and_drop');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Drag and Drop');
    
    // Verify both draggable elements are visible
    await expect(page.locator('#column-a')).toBeVisible();
    await expect(page.locator('#column-b')).toBeVisible();
  });

  test('Initial State', async ({ page }) => {
    // Verify initial positions
    const columnA = page.locator('#column-a header');
    const columnB = page.locator('#column-b header');
    
    await expect(columnA).toHaveText('A');
    await expect(columnB).toHaveText('B');
  });

  test('Drag Column A to Column B', async ({ page }) => {
    const columnA = page.locator('#column-a');
    const columnB = page.locator('#column-b');
    
    // Get initial positions
    const columnAHeader = page.locator('#column-a header');
    const columnBHeader = page.locator('#column-b header');
    
    await expect(columnAHeader).toHaveText('A');
    await expect(columnBHeader).toHaveText('B');
    
    // Perform drag and drop
    await columnA.dragTo(columnB);
    
    // Verify positions are swapped
    await expect(columnAHeader).toHaveText('B');
    await expect(columnBHeader).toHaveText('A');
  });

  test('Drag Column B to Column A', async ({ page }) => {
    const columnA = page.locator('#column-a');
    const columnB = page.locator('#column-b');
    
    // Perform drag and drop
    await columnB.dragTo(columnA);
    
    // Verify positions are swapped
    const columnAHeader = page.locator('#column-a header');
    const columnBHeader = page.locator('#column-b header');
    
    await expect(columnAHeader).toHaveText('B');
    await expect(columnBHeader).toHaveText('A');
  });

  test('Drag and Drop Multiple Times', async ({ page }) => {
    const columnA = page.locator('#column-a');
    const columnB = page.locator('#column-b');
    const columnAHeader = page.locator('#column-a header');
    const columnBHeader = page.locator('#column-b header');
    
    // First swap
    await columnA.dragTo(columnB);
    await expect(columnAHeader).toHaveText('B');
    await expect(columnBHeader).toHaveText('A');
    
    // Swap back
    await columnA.dragTo(columnB);
    await expect(columnAHeader).toHaveText('A');
    await expect(columnBHeader).toHaveText('B');
  });
});
