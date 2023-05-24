import fs from "fs";
import { Browser, Locator, Page } from "playwright";

import { locators } from "./locators";
import { evaluators } from "./evaluators";
import { runInsertQuery } from "./database";

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
  return Object.fromEntries(data);
}

/**
 * Draws an outline around the located elements, so that they can
 * easily be identified in debug screenshots
 */
async function outlineElement(locator: Locator) {
  locator.evaluate((element) => {
    element.style.outline = "3px dashed red";
    element.style.outlineOffset = "3px";
  });
}

/**
 * Adds extra properties to each item in the array `data`, currently
 * the type of the data item as should be returned by the locator, and
 * the url of the site the element was scraped from.
 */
function augmentData<T extends Record<string, unknown>>(
  data: T[],
  url: string,
  itemType: string
) {
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

      if (process.env.DEBUG === "true") {
        // Draw element outlines if debug set to true
        await Promise.all(elements.map(outlineElement));
      }

      const augmentedData = augmentData(data, url, itemType);
      return augmentedData;
    })
  );
  return results.flat(1);
}

/** Returns a folder path where site files should be stored */
function getSiteFolder(url: string) {
  return `output/${new URL(url).host}`;
}

/**
 * Scrapes a web page for its contents.
 * First we run each locator on the page to find all relevant elements,
 * then we run each evaluator on each element found to generate a data
 * represetation of whatever we are interested in.
 */
export async function scrape(
  browser: Browser,
  url: string,
  resolution: number[]
) {
  const screenWidth = resolution[0];
  const screenHeight = resolution[1];

  // Parse and evaluate the page
  const page = await browser.newPage({
    viewport: { width: screenWidth, height: screenHeight },
  });

  try {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
  } catch (e) {
    console.log(`${url}: ERROR: ${e}`);
  }

  const elements = await locateElements(page);
  const results = await generateResults(elements, url);

  // Store results
  const screenshotPath = `${getSiteFolder(url)}/${screenWidth}x${screenHeight}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const siteId = await runInsertQuery("Website", {
    url,
    screenshot: screenshotPath,
    width: screenWidth,
    height: screenHeight,
  });

  await Promise.all(
    results.map((result) => {
      return runInsertQuery("Element", {
        website: siteId,
        type: result.type,
        text: result.text,
        x: result.dimensions?.x,
        y: result.dimensions?.y,
        width: result.dimensions?.width,
        height: result.dimensions?.height,
      });
    })
  );

  page.close();
  return results;
}

/**
 * Scrapes the given website once for each different resolution, saving the
 * results into the database and filesystem
 */
export async function processWebsite(
  browser: Browser,
  url: string,
  resolutions: number[][]
) {
  console.log(`${url}: Scraping...`);
  // Create filesystem storage for screenshots
  const folderName = getSiteFolder(url);
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  // Scrape and save data
  let results = [];

  // Process resolutions in parallel
  const res = await Promise.all(
    resolutions.map((resolution) => scrape(browser, url, resolution))
  );
  results = res.flat(1);

  console.log(`${url}: Done.`);

  return results;
}
