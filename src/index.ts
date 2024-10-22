'phantombuster command: nodejs';
'phantombuster package: 5';
'phantom image: web-node:v3';
'phantombuster flags: save-folder';

import Buster from 'phantombuster';
import puppeteer from 'puppeteer';
import Ajv from 'ajv';
import { Browser } from 'puppeteer';
import { Recipe, Arguments } from './types/types';
import { argumentSchema } from './schemas/argument';

const buster = new Buster();
const ajv = new Ajv();

async function scrapeRecipesFromPage(
  browser: Browser,
  search: string,
  pageNumber: number
): Promise<Recipe[]> {
  const offset = pageNumber * 24;
  const baseUrl = `https://www.allrecipes.com/search?q=${search}&offset=${offset}`;
  const page = await browser.newPage();
  await page.goto(baseUrl, {
    waitUntil: 'domcontentloaded'
  });

  // we do a screenshot for debugging purpose
  await page.screenshot({ path: `allrecipes_${pageNumber}.png` });

  const recipes: Recipe[] = await page.evaluate(() => {
    // /!\ we are in the browser's context here, console.log() won't work
    const data: Recipe[] = [];
    document
      .querySelectorAll('[id^="mntl-card-list-items_"]')
      .forEach((element) => {
        if (element instanceof HTMLAnchorElement) {
          const name = element.querySelector('.card__title')?.textContent;
          const numberReviewsNode = element.querySelector(
            '.mm-recipes-card-meta__rating-count-number'
          );
          const numberReviewsText = numberReviewsNode?.firstChild;
          const numberReviews = Number(
            numberReviewsNode
              ?.removeChild(numberReviewsText!)
              .textContent?.replace(',', '')
          );
          data.push({
            name,
            numberReviews,
            url: element.href
          });
        }
      });
    return data;
  });
  await page.close();
  return recipes;
}

(async () => {
  try {
    const validate = ajv.compile(argumentSchema);
    const arg = buster.argument as Arguments;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    if (!validate(arg)) {
      throw new Error(JSON.stringify(validate.errors));
    }
    console.info(`... Searching Allrecipes.com with ${arg.search}`);

    const search = arg.search.replace(' ', '+');
    const pages = arg.pages || 1;

    const recipes: Recipe[] = [];

    // here we loop for the number of pages
    for (let i = 0; i < pages; i++) {
      recipes.push(...(await scrapeRecipesFromPage(browser, search, i)));
    }

    console.info('Finished scraping recipes');
    console.info(recipes);
    await buster.setResultObject(recipes);

    await browser.close();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
