"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start_scraping_devel_uk = void 0;
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const ps3gamesUK_1 = require("../links/ps3gamesUK");
const scrape_utils_1 = require("../common/scrape_utils");
const pathPS3 = "data/te.txt";
async function start_scraping_devel_uk(page_param) {
    const pathPS3 = `data/united_kingdom-page${page_param}-devel.txt`;
    const browser = await puppeteer.launch({
        headless: 'new',
    });
    const page = await browser.newPage();
    puppeteer.use(pluginStealth());
    const page_index = page_param - 1;
    try {
        await page.goto(ps3gamesUK_1.link_array[page_index], { waitUntil: 'domcontentloaded' });
        console.log(ps3gamesUK_1.link_array[page_index]);
        // Check if the URL is allowed by robots.txt before proceeding
        const isAllowed = await (0, scrape_utils_1.checkRobotsTxt)(page);
        if (!isAllowed) {
            console.log('Access to the current URL is disallowed by robots.txt. Skipping...');
        }
        await page.waitForSelector('.product-main-price', { timeout: 60000 });
        await page.waitForSelector('.card-title a', { timeout: 60000 });
        const titles = await page.$$eval('.card-title a', elements => {
            return elements.map(element => element.textContent.trim());
        });
        const prices = await page.$$eval('.product-main-price', elements => {
            return elements.map(element => element.textContent.trim());
        });
        fs.appendFile(pathPS3, `${ps3gamesUK_1.link_array[page_index]} \n`)
            .then(() => {
        })
            .catch((error) => {
            console.log(`Error: ${error}`);
        });
        for (let j = 0; j < prices.length; j++) {
            const data = `${titles[j]}: ${prices[j]}`;
            console.log(data);
            fs.appendFile(pathPS3, data + "\n")
                .then(() => {
            })
                .catch((error) => {
                console.log(`Error: ${error}`);
            });
        }
        console.log(`\n`);
        // Introduce random delays between requests
        await page.waitForTimeout(Math.floor(Math.random() * 10000) + 20000);
    }
    catch (error) {
        console.log(`Error encountered: ${error}`);
        return;
    }
    finally {
        await browser.close();
        console.log("The data has been saved to the yourdir/Cex-scraper/data");
        console.log("You may now close the program.");
        return;
    }
}
exports.start_scraping_devel_uk = start_scraping_devel_uk;
//# sourceMappingURL=scrapeDevelUK.js.map