"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const ps3games_1 = require("./ps3games");
const link_array = [ps3games_1.URL_1, ps3games_1.URL_2, ps3games_1.URL_3, ps3games_1.URL_4, ps3games_1.URL_5, ps3games_1.URL_6, ps3games_1.URL_7, ps3games_1.URL_8, ps3games_1.URL_9, ps3games_1.URL_10, ps3games_1.URL_11, ps3games_1.URL_12, ps3games_1.URL_13, ps3games_1.URL_14, ps3games_1.URL_15,
    ps3games_1.URL_16, ps3games_1.URL_17, ps3games_1.URL_18, ps3games_1.URL_19, ps3games_1.URL_20, ps3games_1.URL_21, ps3games_1.URL_22, ps3games_1.URL_23, ps3games_1.URL_24, ps3games_1.URL_25, ps3games_1.URL_26, ps3games_1.URL_27, ps3games_1.URL_28, ps3games_1.URL_29, ps3games_1.URL_30,
    ps3games_1.URL_31, ps3games_1.URL_32, ps3games_1.URL_33, ps3games_1.URL_34, ps3games_1.URL_35, ps3games_1.URL_36, ps3games_1.URL_37, ps3games_1.URL_38, ps3games_1.URL_39, ps3games_1.URL_40, ps3games_1.URL_41, ps3games_1.URL_42, ps3games_1.URL_43, ps3games_1.URL_44, ps3games_1.URL_45,
    ps3games_1.URL_46, ps3games_1.URL_47, ps3games_1.URL_48, ps3games_1.URL_49, ps3games_1.URL_50, ps3games_1.URL_51, ps3games_1.URL_52, ps3games_1.URL_53, ps3games_1.URL_54, ps3games_1.URL_55, ps3games_1.URL_56, ps3games_1.URL_57, ps3games_1.URL_58, ps3games_1.URL_59
];
const purple = '\x1b[35m';
const exit = '\x1b[0m';
const app = express();
const PORT = 6969;
async function start_scraping() {
    for (let i = 0; i < link_array.length; i++) {
        const browser = await puppeteer.launch({
        // headless: false,
        });
        const page = await browser.newPage();
        puppeteer.use(pluginStealth());
        try {
            await page.goto(link_array[i], { waitUntil: 'domcontentloaded' });
            console.log(link_array[i]);
            // Check if the URL is allowed by robots.txt before proceeding
            const isAllowed = await checkRobotsTxt(page);
            if (!isAllowed) {
                console.log('Access to the current URL is disallowed by robots.txt. Skipping...');
                continue;
            }
            await page.waitForSelector('.product-main-price');
            await page.waitForSelector('.card-title a');
            const titles = await page.$$eval('.card-title a', elements => {
                return elements.map(element => element.textContent.trim());
            });
            const prices = await page.$$eval('.product-main-price', elements => {
                return elements.map(element => element.textContent.trim());
            });
            for (let i = 0; i < prices.length; i++) {
                console.log(`Price of ${titles[i]}: ${prices[i]}`);
            }
            console.log(`\n\n\n`);
            // Introduce random delays between requests
            await page.waitForTimeout(Math.floor(Math.random() * 13000) + 6000);
        }
        catch (error) {
            console.log(`Error encountered: ${error}`);
        }
        finally {
            await browser.close();
        }
    }
}
async function checkRobotsTxt(page) {
    const robotsTxtUrl = page.url().replace(/\/$/, '') + '/robots.txt';
    const robotsTxtResponse = await page.goto(robotsTxtUrl, { waitUntil: 'networkidle2' });
    if (robotsTxtResponse.status() === 200) {
        const robotsTxtContent = await page.evaluate(() => document.body.textContent);
        const isAllowed = !/User-agent: \*\s+Disallow:\s*\//.test(robotsTxtContent);
        return isAllowed;
    }
    // If unable to fetch robots.txt, assume it's allowed
    return true;
}
start_scraping();
const server = app.listen(PORT, () => console.log(`${purple}Server is listening on PORT: ${PORT}${exit}`));
//# sourceMappingURL=index.js.map