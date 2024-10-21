'phantombuster command: nodejs';
'phantombuster package: 5';
'phantom image: web-node:v1';
'phantombuster flags: save-folder';

const Buster = require('phantombuster');
const puppeteer = require('puppeteer');
const buster = new Buster();

type Recipe = {
  name?: string | null;
  url: string | null;
  numberReviews: number;
  // rating: number; TODO: scrape rating
};

(async () => {
  try {
    const arg = buster.argument; // TODO: Typing and  JSON Schema validation
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });

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
          const name = element.querySelector('.card__title')?.textContent;
          const url = element.getAttribute('href');
          const numberReviewsNode = element.querySelector(
            '.mm-recipes-card-meta__rating-count-number'
          );
          const numberReviewsText = numberReviewsNode?.firstChild;
          const numberReviews = Number(
            numberReviewsNode?.removeChild(numberReviewsText!).textContent
          );
          data.push({
            url,
            name,
            numberReviews
          });
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
