'phantombuster command: nodejs';
'phantombuster package: 5';
'phantom image: web-node:v3';
'phantombuster flags: save-folder';

import Buster from 'phantombuster';
import puppeteer from 'puppeteer';
import Ajv from 'ajv';
import { Arguments } from './types';
import { argumentSchema } from './schemas/argument';
import { scrapeRecipes } from './scraping/allRecipes';

const buster = new Buster();
const ajv = new Ajv();

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

    console.info(
      `Searching Allrecipes.com with ${arg.search} ${
        arg.pages ? `| pages: ${arg.pages}` : ''
      }`
    );

    const recipes = await scrapeRecipes(browser, arg.search, arg.pages);

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
