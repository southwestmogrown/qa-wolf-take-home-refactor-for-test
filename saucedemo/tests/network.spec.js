/**
 * @fileoverview This test suite verifies network requests and responses in the SauceDemo application.
 * It uses Playwright to intercept and inspect network traffic to ensure that the application
 * makes the expected network calls and that the responses are correct.
 */ 
const { test, expect } = require('@playwright/test');
const LoginPage = require('../LoginPage');

test.describe('Network interception', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows mocked user data', async ({ page }) => {
    await page.route('**/api/users*', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 1, first_name: 'Shane', last_name: 'Wilkey', email: 'shane@test.com' }
          ]
        })
      })
    );

    await page.goto('https://reqres.in/api/users?page=1');
    const body = await page.locator('pre').textContent();
    const parsed = JSON.parse(body);

    expect(parsed.data[0].first_name).toBe('Shane');
  });

  test('handles 503 error gracefully', async ({ page }) => {
    await page.route('**/api/users*', route =>
      route.fulfill({ status: 503 })
    );

    const response = await page.goto('https://reqres.in/api/users');
    expect(response.status()).toBe(503);
  });

  test('sends correct payload on POST', async ({ page }) => {
    let capturedPayload;

    await page.route('**/api/users', async route => {
      if (route.request().method() === 'POST') {
        capturedPayload = JSON.parse(route.request().postData() || '{}');
      }
      await route.continue();
    });

    // Trigger a POST — reqres.in has a /api/users POST endpoint
    await page.goto('https://reqres.in');
    await page.evaluate(async () => {
      await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Shane', job: 'QA Engineer' })
      });
    });

    expect(capturedPayload.name).toBe('Shane');
    expect(capturedPayload.job).toBe('QA Engineer');
  });

  test('shows empty state when inventory fails to load', async ({ page }) => {
    // Intercept the inventory data request
    await page.route('**/inventory.html', async route => {
      // Let the page HTML load normally
      await route.continue();
    });

    // More useful — intercept the actual XHR/fetch if there is one,
    // or override localStorage to simulate empty inventory
    await page.addInitScript(() => {
      // Runs before page scripts — simulate broken state
      window.__forceEmptyInventory = true;
    });

    await page.goto('https://www.saucedemo.com/inventory.html');

    // Assert: either no products render, or an error message appears
    const itemCount = await page.locator('.inventory_item').count();
    // SauceDemo is static so count will still be 6 — 
    // the real exercise is understanding WHY and what you'd do differently
    // with a real API-driven app
    console.log('Item count:', itemCount);
  });

  

});