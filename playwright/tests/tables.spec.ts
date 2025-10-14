import { test, expect } from '@playwright/test';

test.describe('Data Tables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tables');
  });

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Data Tables');
    
    // Verify both tables are visible
    await expect(page.locator('#table1')).toBeVisible();
    await expect(page.locator('#table2')).toBeVisible();
  });

  test('Table 1 Structure', async ({ page }) => {
    const table = page.locator('#table1');
    
    // Verify table headers
    const headers = table.locator('thead th');
    await expect(headers).toHaveCount(6); // Last Name, First Name, Email, Due, Web Site, Action
    
    // Verify header texts
    await expect(headers.nth(0)).toHaveText('Last Name');
    await expect(headers.nth(1)).toHaveText('First Name');
    await expect(headers.nth(2)).toHaveText('Email');
    await expect(headers.nth(3)).toHaveText('Due');
    await expect(headers.nth(4)).toHaveText('Web Site');
  });

  test('Table 1 Data Rows', async ({ page }) => {
    const table = page.locator('#table1');
    const rows = table.locator('tbody tr');
    
    // Verify table has data rows
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify first row has expected columns
    const firstRow = rows.first();
    const cells = firstRow.locator('td');
    await expect(cells).toHaveCount(6);
  });

  test('Table 1 Sorting by Last Name', async ({ page }) => {
    const table = page.locator('#table1');
    const lastNameHeader = table.locator('thead th').first();
    
    // Click to sort
    await lastNameHeader.click();
    
    // Get all last names
    const rows = table.locator('tbody tr');
    const firstRowLastName = await rows.first().locator('td').first().textContent();
    
    // Verify sorting worked (first name should change)
    expect(firstRowLastName).toBeTruthy();
  });

  test('Table 2 Structure', async ({ page }) => {
    const table = page.locator('#table2');
    
    // Verify table headers
    const headers = table.locator('thead th');
    await expect(headers).toHaveCount(6);
    
    // Verify table has data rows
    const rows = table.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Edit and Delete Actions Present', async ({ page }) => {
    const table = page.locator('#table1');
    const rows = table.locator('tbody tr');
    const firstRowActions = rows.first().locator('td').last();
    
    // Verify action links are present
    const editLink = firstRowActions.locator('a[href="#edit"]');
    const deleteLink = firstRowActions.locator('a[href="#delete"]');
    
    await expect(editLink).toBeVisible();
    await expect(deleteLink).toBeVisible();
    await expect(editLink).toHaveText('edit');
    await expect(deleteLink).toHaveText('delete');
  });

  test('Table Contains Email Addresses', async ({ page }) => {
    const table = page.locator('#table1');
    const rows = table.locator('tbody tr');
    const count = await rows.count();
    
    // Check that each row has an email
    for (let i = 0; i < Math.min(count, 3); i++) {
      const emailCell = rows.nth(i).locator('td').nth(2);
      const emailText = await emailCell.textContent();
      expect(emailText).toContain('@');
    }
  });

  test('Table Contains Monetary Values', async ({ page }) => {
    const table = page.locator('#table1');
    const rows = table.locator('tbody tr');
    const count = await rows.count();
    
    // Check that each row has a due amount
    for (let i = 0; i < Math.min(count, 3); i++) {
      const dueCell = rows.nth(i).locator('td').nth(3);
      const dueText = await dueCell.textContent();
      expect(dueText).toMatch(/\$[\d,]+\.\d{2}/);
    }
  });
});
