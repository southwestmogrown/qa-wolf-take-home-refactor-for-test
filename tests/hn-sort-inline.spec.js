const { test, expect } = require('@playwright/test');
const CONFIG = require('../config');

const { parseHNTimestamp } = require('../utils/time');

test.describe('HN /newest feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONFIG.HN_NEWEST_URL);
  });

  test('page title contains Hacker News', async ({ page }) => {
    await expect(page).toHaveTitle(/Hacker News/);
  });


  test('first 100 HN articles are sorted newest to oldest', async ({ page }) => {
    // perform logic in line
    const articles = [];

    while (articles.length < CONFIG.ARTICLE_COUNT) {
      await page.waitForSelector(CONFIG.AGE_SELECTOR);

      const pageArticles = await page.evaluate(({
        ageSelector, titleSelector
      }) => {
        const ageElements = Array.from(document.querySelectorAll(ageSelector));
        const titleElements = Array.from(document.querySelectorAll(titleSelector));

        return ageElements.map((ageEl, i) => ({
          rawTimestamp: (ageEl.parentElement.getAttribute("title") || "").split(" ")[0],
          title: titleElements[i] ? titleElements[i].innerText.trim() : "",
        }));
      },
      {
        ageSelector: CONFIG.AGE_SELECTOR,
        titleSelector: CONFIG.TITLE_SELECTOR,
      }); 

      if (pageArticles.length === 0) {
        throw new Error(
          `No articles found on page after collecting ${articles.length}. ` +
            `Possible bot detection or selector drift.`,
        );
      }

      const needed = CONFIG.ARTICLE_COUNT - articles.length;
      articles.push(...pageArticles.slice(0, needed));

      if (articles.length >= CONFIG.ARTICLE_COUNT) break;

      const moreLink = page.locator(CONFIG.MORE_LINK_SELECTOR);
      const moreLinkCount = await moreLink.count();

      if (moreLinkCount === 0) {
        throw new Error(
          `Pagination failed: reached end of HN /newest after ${articles.length} articles ` +
            `but needed ${CONFIG.ARTICLE_COUNT}. HN may have fewer articles available.`,
        );
      }

      await moreLink.click();
      await page.waitForLoadState("domcontentloaded");
    }

    for (let i = 1; i < articles.length; i++) {
      const prev = parseHNTimestamp(articles[i - 1].rawTimestamp);
      const curr = parseHNTimestamp(articles[i].rawTimestamp);
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});