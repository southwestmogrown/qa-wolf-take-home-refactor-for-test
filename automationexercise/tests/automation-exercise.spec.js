const { test, expect } = require('@playwright/test');

test.describe('Automation Exercise - Product Search & Cart', () => {

  test('should search for a product and add it to cart', async ({ page }) => {
    await page.goto('https://www.automationexercise.com');

    // Close consent popup if present
    const consent = page.locator('#consent-banner button');
    if (await consent.isVisible({ timeout: 3000 })) {
      await consent.click();
    }

    // Navigate to products page
    await page.locator('a[href="/products"]').click(); // weak selector
    await page.waitForURL('**/products'); // no timeouts

    // Search for a product
    await page.locator('#search_product').fill('tshirt'); // weak selector
    await page.locator('#submit_search').click();
    await page.waitForResponse(res => res.url().includes('search') && res.status() === 200);  // no timeouts

    // Click first product
    await page.locator('.product-image-wrapper').first().click(); // weak selector

    // On product detail page
    await page.waitForURL('**/product_details/**'); // no timeouts
    await page.locator('.product-information h2').click();  // weak selector
    await page.locator('input[name="quantity"]').fill('2'); // weak selector
    await page.locator('button:has-text("Add to cart")').click(); // weak selector

    // Handle modal
    await page.waitForSelector('.modal-footer button'); // no timeouts
    await page.locator('.modal-footer button').click(); // weak selector 

    // Go to cart
    await page.locator('a[href="/view_cart"]').click(); // weak selector

    await page.waitForURL('**/view_cart'); // no timeouts

    // Assertions
    await expect(page.locator('td.cart_description')).toContainText('Tshirt'); // fixed selector
    await expect(page.locator('td.cart_quantity')).toHaveText('2'); // fixed selector
    await expect(page.locator('td.cart_total')).toBeVisible(); // correct assertion pattern
  });

});