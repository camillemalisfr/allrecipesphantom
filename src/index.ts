'phantombuster command: nodejs';
'phantombuster package: 5';
'phantom image: web-node:v3';
'phantombuster flags: save-folder';

import Buster from 'phantombuster';
import puppeteer from 'puppeteer';
import { scrapeRecipes } from './scraping/allRecipes';
import { validateArgs } from './utils/validation';

const buster = new Buster();

(async () => {
  try {
    // const arg = buster.argument as Arguments;
    const { search, pages } = validateArgs(buster.argument);
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    console.info(
      `Searching Allrecipes.com with ${search} ${
        pages ? `| pages: ${pages}` : ''
      }`
    );

    const recipes = await scrapeRecipes(browser, search, pages);

    console.info(`Successfully scraped ${recipes.length} recipes`);
    console.debug(recipes);
    await buster.setResultObject(recipes);

    await browser.close();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
