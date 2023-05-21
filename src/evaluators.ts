import { Locator } from "playwright";

async function evaluateInnerText(locator: Locator) {
  const dataKey = "text";
  const data = await locator.innerText();
  return [dataKey, data] as const;
}

async function evaluateDimensions(locator: Locator) {
  const dataKey = "dimensions";
  const data = await locator.boundingBox();
  return [dataKey, data] as const;
}

/**
 * Each evaluator is a function that takes a `Locator` as the
 * only argument, returning a tuple of the type of data the function
 * has evaluated (which can and should be used as the key for the data)
 * and the data itself that got evaluated.
 */
export const evaluators = [evaluateInnerText, evaluateDimensions];
