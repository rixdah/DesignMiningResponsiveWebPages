import fs from "fs";
import { chromium } from "playwright";
import { processWebsite } from "./src/scraper";

const input = fs.readFileSync("input.txt").toString();
const urls = input
  .split("\n")
  .filter((line) => line !== "" && !line.startsWith("//"));

const resolutions = [
  [1920, 1080], // Desktop
  [768, 1024], // Tablet
  [360, 800], // Mobile
];

const browser = await chromium.launch({
  headless: process.env.DEBUG !== "true",
});

let results = [];

console.log(`Found ${urls.length} urls.`);
console.log("Starting scraping...");

for (const url of urls) {
  results.push(...(await processWebsite(browser, url, resolutions)));
}

await browser.close();

console.log("Scraping done.");
console.log(
  `Scraped ${urls.length} websites with ${resolutions.length} resolutions.`
);
console.log(`Found total ${results.length} elements.`);
