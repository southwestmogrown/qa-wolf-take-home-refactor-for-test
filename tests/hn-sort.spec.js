const { test, expect } = require('@playwright/test');
const CONFIG = require('../config');

const { scrapeArticles } = require('../scraper');
const { validateSortOrder } = require('../validator');

test.describe('HN /newest feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONFIG.HN_NEWEST_URL);
  });

  test('page title contains Hacker News', async ({ page }) => {
    await expect(page).toHaveTitle(/Hacker News/);
  });


  test('first 100 HN articles are sorted newest to oldest', async ({ page }) => {
    const articles = await scrapeArticles();
    const result = validateSortOrder(articles);
    expect(result.passed).toBe(true);
    expect(result.checked).toBe(CONFIG.ARTICLE_COUNT);

    if (result.violations.length > 0) {
      expect(result.violations[0].message).toBeUndefined();
    }
  });
}); 