/** Global setup for Playwright tests
 * This file can be used to perform setup tasks that need to run
 * once before the test suite runs, such as setting environment
 * variables, preparing test data, or other global initialization
 * that should happen before tests execute.
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

module.exports = async () => {
  // Make sure the .auth directory exists
  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/inventory.html');
  await page.context().storageState({ path: '.auth/session.json' });
  await browser.close();
};