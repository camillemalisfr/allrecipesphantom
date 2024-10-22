import { Browser } from 'puppeteer';
import { Recipe } from '../types';

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

export async function scrapeRecipes(
  browser: Browser,
  search: string,
  pages: number = 1
): Promise<Recipe[]> {
  search = search.replace(' ', '+');

  const recipes: Recipe[] = [];

  // here we loop for the number of pages
  for (let i = 0; i < pages; i++) {
    recipes.push(...(await scrapeRecipesFromPage(browser, search, i)));
  }

  return recipes;
}
