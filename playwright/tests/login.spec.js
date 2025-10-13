const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');

let serverProcess = null;

test.beforeAll(async () => {
  // start the Sinatra app with `bundle exec rackup` on port 4567
  // using `bundle exec` ensures the rackup executable from the project's Gemfile is used.
  serverProcess = spawn('bundle', ['exec', 'rackup', '-p', '4567'], { stdio: 'inherit' });
  // wait a bit for the server to start
  await new Promise((r) => setTimeout(r, 3000));
});

test.afterAll(() => {
  if (serverProcess) serverProcess.kill();
});

test.describe('Login page', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await page.goto('/login');
  // use the app's real credentials
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator('h2')).toContainText('Secure Area');
  });

  test('fails with incorrect credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'asdf');
    await page.fill('#password', 'asdf');
    await page.click('button[type="submit"]');
    // redirects back to /login with flash error
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#flash')).toHaveClass(/error/);
  });
});
