import { chromium } from "playwright";
import { scrape } from "./src/scraper";

const urls = ["https://getbootstrap.com/"];

const browser = await chromium.launch({ headless: false });

let results = [];

for (const url of urls) {
  results.push(...(await scrape(browser, url)));
}

await browser.close();

console.log(results);
