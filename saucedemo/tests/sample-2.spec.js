const { test, expect } = require('@playwright/test');
// const InventoryPage = require('../InventoryPage');
// const CartPage = require('../CartPage');

test.describe('SauceDemo cart management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
  });

  
  test('cart badge updates correctly', async ({ page }) => {
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    
    await page.locator('.btn_inventory').first().click();
    
    const badge = await page.locator('.shopping_cart_badge').innerText();
    expect(badge).toBe('1');
    
    await page.locator('.btn_inventory').nth(1).click();
    await page.locator('.btn_inventory').nth(2).click();
    
    const badgeCount = await page.locator('.shopping_cart_badge').innerText();
    expect(badgeCount).toBe('3');
  });
  
  test('cart persists across navigation', async ({ page }) => {
    await page.locator('.btn_inventory').first().click();
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    const badge = await page.locator('.shopping_cart_badge').innerText();
    expect(badge).toBe('1');
    
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
  
  test('removes item from cart correctly', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await page.locator('.inventory_item').nth(1).locator('.btn_inventory').click();

    await page.locator('.shopping_cart_link').click();

    const itemCount = await page.locator('.cart_item').count();
    expect(itemCount).toBe(2);

    const item = await page.locator('.cart_item').first();
    await item.getByRole('button', { name: 'Remove' }).click();
    const newCount = await page.locator('.cart_item').count();
    expect(newCount).toBe(1);

    const remainingItem = await page.locator('.cart_item .inventory_item_name').innerText();
    expect(remainingItem).not.toBe('');
  });

  test('can checkout with empty cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/cart.html');
    
    await page.getByRole('button', { name: 'Checkout' }).click();
    
    await expect(page).toHaveURL(/checkout-step-one/);
  });

});