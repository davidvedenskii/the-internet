import { test, expect } from '@playwright/test';

test.describe('Add/Remove Elements Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add_remove_elements/');
  });

  test('Initial Page Load', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify Add Element button
    const addButton = page.getByRole('button', { name: 'Add Element' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    
    // Verify page layout
    const mainContent = page.locator('#content');
    await expect(mainContent).toBeVisible();
  });

  test('Add Single Element', async ({ page }) => {
    // Click Add Element button
    await page.getByRole('button', { name: 'Add Element' }).click();
    
    // Verify new Delete button
    const deleteButton = page.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toBeEnabled();
    
    // Verify button class
    await expect(deleteButton).toHaveClass('added-manually');
  });

  test('Add Multiple Elements', async ({ page }) => {
    // Add 5 elements
    const addButton = page.getByRole('button', { name: 'Add Element' });
    for (let i = 0; i < 5; i++) {
      await addButton.click();
    }
    
    // Verify all Delete buttons
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    await expect(deleteButtons).toHaveCount(5);
    
    // Verify all buttons are clickable
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      await expect(deleteButtons.nth(i)).toBeEnabled();
    }
  });

  test('Remove Single Element', async ({ page }) => {
    // Add and then remove a single element
    await page.getByRole('button', { name: 'Add Element' }).click();
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    await expect(deleteButtons).toHaveCount(1);
    
    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(0);
  });

  test('Remove Multiple Elements', async ({ page }) => {
    // Add 5 elements
    const addButton = page.getByRole('button', { name: 'Add Element' });
    for (let i = 0; i < 5; i++) {
      await addButton.click();
    }
    
    // Remove elements one by one
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    await expect(deleteButtons).toHaveCount(5);
    
    for (let i = 4; i >= 0; i--) {
      await deleteButtons.nth(0).click();
      await expect(deleteButtons).toHaveCount(i);
    }
  });
});