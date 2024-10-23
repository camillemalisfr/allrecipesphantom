import { Browser } from 'puppeteer';
import { Recipe } from '../types';

const baseUrl = 'https://www.allrecipes.com';

async function scrapeRecipesFromPage(
  browser: Browser,
  search: string,
  pageNumber: number
): Promise<Recipe[]> {
  const offset = pageNumber * 24;
  const url = `${baseUrl}/search?q=${search}&offset=${offset}`;
  const page = await browser.newPage();
  await page.goto(url, {
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
          const getNumberReviews = () => {
            const numberReviewsNode = element.querySelector(
              '.mm-recipes-card-meta__rating-count-number'
            );
            const numberReviewsText = numberReviewsNode?.firstChild;
            const numberReviews = Number(
              numberReviewsNode
                ?.removeChild(numberReviewsText!)
                .textContent?.replace(',', '')
            );
            return numberReviews;
          };

          const name = element.querySelector('.card__title')?.textContent;

          data.push({
            name,
            numberReviews: getNumberReviews(),
            url: element.href
          });
        }
      });
    return data;
  });
  await page.close();
  return recipes;
}

export async function scrapeRecipes(
  browser: Browser,
  search: string,
  pages: number = 1
): Promise<Recipe[]> {
  search = search.replace(' ', '+');
  const recipes: Recipe[] = [];

  // we loop for the number of pages we want to scrape
  for (let i = 0; i < pages; i++) {
    recipes.push(...(await scrapeRecipesFromPage(browser, search, i)));
  }

  return recipes;
}
