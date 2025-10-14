const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30_000,
  testDir: './playwright',
  expect: { timeout: 5000 },
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    baseURL: 'https://the-internet.herokuapp.com'
  }
});
