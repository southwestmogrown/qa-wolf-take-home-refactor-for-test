const { test, expect } = require('@playwright/test');

const CONFIG = require('../config');
const LoginPage = require('../LoginPage');


test.describe('SauceDemo Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display error for locked out user', async () => {
    await loginPage.login(CONFIG.LOCKED_OUT_USER, CONFIG.PASSWORD);
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface: Sorry, this user has been locked out./);
  });

  test('should login successfully with standard user', async () => {
    await loginPage.login(CONFIG.STANDARD_USER, CONFIG.PASSWORD);
    await expect(loginPage.page).toHaveURL(/inventory.html/);
  });

  test('should display error for missing username', async () => {
    await loginPage.login('', CONFIG.PASSWORD);
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface: Username is required/);
  });

  test('should display error for missing password', async () => {
    await loginPage.login(CONFIG.STANDARD_USER, '');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface: Password is required/);
  });

  test('should display error for invalid username/password', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface: Username and password do not match any user in this service/);
  });

  test('should display error for empty username and password', async () => {
    await loginPage.login('', '');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface: Username is required/);
  });

  const USERS = [
  { 
    username: 'standard_user', 
    password: 'secret_sauce', 
    expectedURL: /inventory/, 
    expectedError: null 
  },
  { 
    username: 'locked_out_user', 
    password: 'secret_sauce', 
    expectedURL: null, 
    expectedError: 'Epic sadface: Sorry, this user has been locked out.' 
  },
  { 
    username: 'invalid_user', 
    password: 'wrong_password', 
    expectedURL: null, 
    expectedError: 'Epic sadface: Username and password do not match any user in this service' 
  },
];

USERS.forEach(({ username, password, expectedURL, expectedError }) => {
  test(`login attempt for user ${username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(username, password);

    if (expectedURL) {
      await expect(page).toHaveURL(expectedURL);
    }

    if (expectedError) {
      const error = page.locator('[data-test="error"]');
      await expect(error).toHaveText(expectedError);
    }
  });
});


});
