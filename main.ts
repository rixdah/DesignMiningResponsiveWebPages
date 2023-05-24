import { chromium } from "playwright";
import { processWebsite } from "./src/scraper";

const urls = [
  "https://www.hydearchitects.com/",
  "https://cozar.me/",
  "https://plazaclassic.com/",
  "https://extrema.be/en/home",
  "https://www.madetogether.com.au/",
  "https://thisisneat.com.au/",
  "https://www.w3.org/",
  "https://www.jimdo.com/",
  "https://www.slideshare.net/",
  "https://en.gravatar.com/",
  "https://medium.com/",
  "https://creativecommons.org/",
  "https://getbootstrap.com/",
  "https://stackoverflow.com/",
  "https://www.etsy.com/",
  "https://www.addthis.com/",
  "https://www.wikipedia.org/",
  "https://www.adobe.com/",
  "https://www.mozilla.org/en-US/",
  "https://vimeo.com/",
  "https://telegram.org/",
  "https://www.paypal.com/fi/home",
  "https://www.brandbucket.com/",
  "https://www.imdb.com/",
];

const resolutions = [
  [1920, 1080], // Desktop
  [768, 1024], // Tablet
  [360, 800], // Mobile
];

const browser = await chromium.launch({ headless: process.env.DEBUG !== "true" });

let results = [];

console.log("Starting scraping...");

for (const url of urls) {
  results.push(...(await processWebsite(browser, url, resolutions)));
}

await browser.close();

console.log("Scraping done.");
console.log(`Scraped ${urls.length} websites with ${resolutions.length} resolutions.`);
console.log(`Found total ${results.length} elements.`);
