const CONFIG = require("./config");

/** 
 * @fileoverview This class represents the inventory page of the Sauce Demo application.
 * It provides methods to interact with the inventory page, such as retrieving
 * product prices, names, and other elements that are displayed on the inventory
 * page. This abstraction allows tests to interact with the inventory page
 * in a structured and maintainable way.
 */
class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page - The Playwright page object
   * that represents the browser page where the inventory page is loaded.
   */
  constructor(page) {
    this.page = page;
    this.prices = [];
  }

  async goto() {
    await this.page.goto(CONFIG.INVENTORY_URL);
  }


  async sortProductsByPriceLowToHigh() {
    await this.page.locator('.product_sort_container').selectOption('lohi');
  }

  async collectAllPricesAsNumbers() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    const parsed = prices.map(p => parseFloat(p.replace('$', '')));
    this.prices = [...parsed];
    return parsed;
  }

  async getProductPrice(productName) {
    const productLocator = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    return productLocator.locator('.inventory_item_price').innerText();
  }

  async getErrorMessage() {
    return this.page.locator('[data-test="error"]');
  }

}

module.exports = InventoryPage;