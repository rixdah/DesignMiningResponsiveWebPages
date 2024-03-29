import { Page } from "playwright";

async function locateHeadings(page: Page) {
  const elementType = "Heading level 1";
  const foundElements = await page.locator("h1").all();
  return [elementType, foundElements] as const;
}

async function locateButtons(page: Page) {
  const elementType = "Button";
  const foundElements = await page.locator(".btn").all();
  return [elementType, foundElements] as const;
}

async function locateNavbars(page: Page) {
  const elementType = "Navbar";
  const foundElements = await page.locator(".navbar").all();
  return [elementType, foundElements] as const;
}

async function locateLinks(page: Page) {
  const elementType = "Link";
  const foundElements = await page.locator("a").all();
  return [elementType, foundElements] as const;
}

/**
 * Each locator takes a `Page` as the only argument, and returns
 * a tuple of element type and a list of all elements of the type
 * that were found by the locator on the page.
 */
export const locators = [locateButtons, locateHeadings, locateNavbars, locateLinks];
