'phantombuster command: nodejs';
'phantombuster package: 5';
'phantom image: web-node:v3';
'phantombuster flags: save-folder';

const Buster = require('phantombuster');
const puppeteer = require('puppeteer');
const Ajv = require('ajv');
const buster = new Buster();
const ajv = new Ajv();

interface Arguments {
  search: string;
}

const argumentSchema = {
  type: 'object',
  properties: {
    search: { type: 'string' }
  },
  required: ['search'],
  additionalProperties: false
};

type Recipe = {
  name?: string | null;
  url: string | null;
  numberReviews: number;
  // rating: number; TODO: scrape rating
};

(async () => {
  try {
    const validate = ajv.compile(argumentSchema);
    const arg: Arguments = buster.argument;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

    if (!validate(arg)) {
      throw new Error(JSON.stringify(validate.errors));
    }

    console.info(`... Searching Allrecipes.com with ${arg.search}`);

    const search = arg.search.replace(' ', '+');
    const baseUrl = `https://www.allrecipes.com/search?q=${search}`;
    const page = await browser.newPage();
    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded'
    });

    // we do a screenshot for debugging purpose
    await page.screenshot({ path: 'allrecipes.png' });

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
              numberReviewsNode?.removeChild(numberReviewsText!).textContent
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

    console.info('Finished scraping recipes');
    console.info(recipes);
    await buster.setResultObject(recipes);
    await page.close();
    await browser.close();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
