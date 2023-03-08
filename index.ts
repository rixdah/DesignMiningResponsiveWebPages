import { chromium } from "playwright";

const browser = await chromium.launch({ headless: false });

const page = await browser.newPage();
await page.goto("https://getbootstrap.com/");
await page.waitForLoadState("networkidle");

const data = await page.$eval("h1", (elem) => elem.innerText);

console.log(data);

await browser.close();
