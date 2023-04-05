import { Browser, Locator, Page } from "playwright";
import { locators } from "./locators";
import { evaluators } from "./evaluators";

/**
 * Applies each locator to a page, returning a list of tuples with
 * the first item as a string of the found element type, and the second
 * item as a list for the `Locator` instances.
 */
async function locateElements(page: Page) {
  const data = await Promise.all(locators.map((locator) => locator(page)));
  return data;
}

/**
 * Applies each evaluator to a locator, returning an object with
 * field keys as the first item in each evaluators tuple, and the
 * field values as the second item in each tuple.
 */
async function evaluateElement(locator: Locator) {
  const data = await Promise.all(
    evaluators.map((evaluator) => evaluator(locator))
  );
  const dataObj: Record<string, unknown> = Object.fromEntries(data);
  return dataObj;
}

/**
 * Adds extra properties to each item in the array `data`, currently
 * the type of the data item as should be returned by the locator, and
 * the url of the site the element was scraped from.
 */
function augmentData(
  data: Record<string, unknown>[],
  url: string,
  itemType: string
): Record<string, unknown>[] {
  const augmentedData = data.map((item) => ({
    type: itemType,
    site: url,
    ...item,
  }));
  return augmentedData;
}

/**
 * Iterates over a list of elements, running each evaluator on each of
 * the elements, and adding data augmentations to the resulting array.
 * The resulting list is flattened so that all elements of different
 * types are on the same level.
 */
async function generateResults(
  elements: (readonly [string, Locator[]])[],
  url: string
) {
  const results = await Promise.all(
    elements.map(async ([itemType, elements]) => {
      const data = await Promise.all(elements.map(evaluateElement));
      const augmentedData = augmentData(data, url, itemType);
      return augmentedData;
    })
  );
  return results.flat(1);
}

/**
 * Scrapes a web page for its contents.
 * First we run each locator on the page to find all relevant elements,
 * then we run each evaluator on each element found to generate a data
 * represetation of whatever we are interested in.
 */
export async function scrape(browser: Browser, url: string) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForLoadState("networkidle");

  const elements = await locateElements(page);
  const results = await generateResults(elements, url);

  return results;
}
