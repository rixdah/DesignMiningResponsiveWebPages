import { chromium } from "playwright";
import { processWebsite } from "./src/scraper";

const urls = [
  "https://getbootstrap.com/",
];

const resolutions = [
  [1920, 1080], // Desktop
  [768, 1024], // Tablet
  [360, 800], // Mobile
];

const browser = await chromium.launch({ headless: false });

let results = [];

console.log("Starting scraping...");

for (const url of urls) {
  results.push(...(await processWebsite(browser, url, resolutions)));
}

await browser.close();

console.log("Scraping done.");
console.log(`Scraped ${urls.length} websites with ${resolutions.length} resolutions.`)
console.log(`Found total ${results.length} elements.`)
