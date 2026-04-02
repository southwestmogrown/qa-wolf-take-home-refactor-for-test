/**
 * @fileoverview This test suite verifies that the prices of the products displayed on the inventory page are correct.
 * It uses Playwright for browser automation and follows a structured approach to ensure that the prices match the expected values.
 * The test suite includes setup and teardown processes to maintain test isolation and reliability.
 */

const { test, expect } = require('@playwright/test');

const CONFIG = require('../config');
const InventoryPage = require('../InventoryPage');

test.describe('SauceDemo Product Prices', () => {
  let inventoryPage;



  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
  });

  test('should order products by price from low to high', async () => {
    await inventoryPage.sortProductsByPriceLowToHigh();
    const prices = await inventoryPage.collectAllPricesAsNumbers();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  const EXPECTED_PRICES = [
    ['Sauce Labs Backpack', '$29.99'],
    ['Sauce Labs Bike Light', '$9.99'],
    ['Sauce Labs Bolt T-Shirt', '$15.99'],
    ['Sauce Labs Fleece Jacket', '$49.99'],
    ['Sauce Labs Onesie', '$7.99'],
    ['Test.allTheThings() T-Shirt (Red)', '$15.99'],
  ];

  for (const [name, expectedPrice] of EXPECTED_PRICES) {
    test(`should have correct price for ${name}`, async () => {
      const price = await inventoryPage.getProductPrice(name);
      expect(price).toBe(expectedPrice);
    });
  }

  test('cart shows correct item details', async () => {
    await inventoryPage.page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await expect.soft(inventoryPage.page.locator('.shopping_cart_badge')).toHaveCount(1);
    await inventoryPage.page.locator('.shopping_cart_link').click();
    await expect.soft(inventoryPage.page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect.soft(inventoryPage.page.getByRole('button', { name: 'Checkout' })).toBeEnabled();

    expect(test.info().errors).toHaveLength(0);
  });
});

