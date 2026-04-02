const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('user can complete checkout', async ({ page }) => {
    await page.click('.inventory_item:first-child .btn_inventory');

    await page.click('.shopping_cart_link');
    const cartItemCount = await page.locator('.cart_item').count();
    expect(cartItemCount).toBe(1);

    await page.click('[data-test="checkout"]');

    await page.fill('[data-test="firstName"]', 'Shane');
    await page.fill('[data-test="lastName"]', 'Wilkey');
    await page.fill('[data-test="postalCode"]', '65807');
    await page.click('[data-test="continue"]');

    const total = await page.locator('.summary_total_label').innerText();
    expect(total).toMatch(/\$/);

    await page.click('[data-test="finish"]');

    const completeHeader = await page.locator('.complete-header').innerText();
    expect(completeHeader).toBe('Thank you for your order!');
    expect(page.url()).toContain('checkout-complete');
  });

  test('order summary shows correct item', async ({ page }) => {
    await page.click('.btn_inventory');
    
    const itemName = await page.locator('.inventory_item_name').first().innerText();
    
    await page.click('.shopping_cart_link');
    
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Shane');
    await page.fill('[data-test="lastName"]', 'Wilkey');  
    await page.fill('[data-test="postalCode"]', '65807');
    await page.click('[data-test="continue"]');

    const cartItemName = await page.locator('.cart_item .inventory_item_name').innerText();
    expect(cartItemName).toBe(itemName);

    await page.click('[data-test="finish"]');
    const completeHeader = await page.locator('.complete-header').innerText();
    expect(completeHeader).toBe('Thank you for your order!');
  });

});