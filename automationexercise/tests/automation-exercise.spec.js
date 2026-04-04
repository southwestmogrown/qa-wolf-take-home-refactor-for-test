const { test, expect } = require('@playwright/test');

test.describe('Automation Exercise - Product Search & Cart', () => {

  test('should search for a product and add it to cart', async ({ page }) => {
    await page.goto('https://www.automationexercise.com');

    // Handle recurring ad overlay
    const handleAd = async () => {
      try {
        const adFrame = page.frameLocator('iframe[name="aswift_3"]');
        const closeBtn = adFrame.getByRole('button', { name: 'Close ad' });
        if (await closeBtn.isVisible({ timeout: 1000 })) {
          await closeBtn.click();
        }
      } catch {}
    };

    page.on('frameattached', handleAd);


    // Navigate to products page
    await page.getByRole('link', { name: 'Products' }).click();
    
    await page.waitForURL('**/products'); // no timeouts

    // Search for a product
    await page.locator('#search_product').fill('tshirt'); 
    await page.locator('#submit_search').click();
    await page.waitForResponse(res => res.url().includes('search') && res.status() === 200);  // no timeouts

    // Click first product
    await page.getByRole('link', { name: 'View Product' }).first().click(); 

    // On product detail page
    await page.waitForURL('**/product_details/**'); // no timeouts
    await page.getByRole('spinbutton').fill('2');
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // Handle modal
    const modalBtn = page.locator('.modal-footer button');
    await modalBtn.waitFor({ state: 'visible' });
    await modalBtn.click();

    // Go to cart
    await page.getByRole('listitem').filter({ hasText: 'Cart' }).click(); 

    await page.waitForURL('**/view_cart'); // no timeouts

    // Assertions
    await expect(page.locator('td.cart_description')).toContainText('Tshirt'); // fixed selector
    await expect(page.locator('td.cart_quantity')).toHaveText('2'); // fixed selector
    await expect(page.locator('td.cart_total')).toBeVisible(); // correct assertion pattern
  });

});