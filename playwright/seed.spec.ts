import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  baseURL: string;
};

export const test = base.extend<TestFixtures>({
  baseURL: ['https://the-internet.herokuapp.com', { scope: 'test' }],
});

// Example of how to use the fixture
test('verify base URL', async ({ page, baseURL }) => {
  await page.goto(baseURL);
  await expect(page).toHaveURL(baseURL);
});
