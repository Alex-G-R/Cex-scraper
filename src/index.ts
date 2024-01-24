
const express = require('express');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
import { URL_1, URL_2, URL_3,URL_4,URL_5,URL_6,URL_7,URL_8,URL_9,URL_10,URL_11,URL_12,URL_13,URL_14,URL_15,
    URL_16,URL_17,URL_18,URL_19,URL_20,URL_21,URL_22,URL_23,URL_24,URL_25,URL_26,URL_27,URL_28,URL_29,URL_30,
    URL_31,URL_32,URL_33,URL_34,URL_35,URL_36,URL_37,URL_38,URL_39,URL_40,URL_41,URL_42,URL_43,URL_44,URL_45,
    URL_46,URL_47,URL_48,URL_49,URL_50,URL_51,URL_52,URL_53,URL_54,URL_55,URL_56,URL_57,URL_58,URL_59
} from './ps3games';

const link_array = [URL_1, URL_2, URL_3,URL_4,URL_5,URL_6,URL_7,URL_8,URL_9,URL_10,URL_11,URL_12,URL_13,URL_14,URL_15,
    URL_16,URL_17,URL_18,URL_19,URL_20,URL_21,URL_22,URL_23,URL_24,URL_25,URL_26,URL_27,URL_28,URL_29,URL_30,
    URL_31,URL_32,URL_33,URL_34,URL_35,URL_36,URL_37,URL_38,URL_39,URL_40,URL_41,URL_42,URL_43,URL_44,URL_45,
    URL_46,URL_47,URL_48,URL_49,URL_50,URL_51,URL_52,URL_53,URL_54,URL_55,URL_56,URL_57,URL_58,URL_59
]

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

        } catch (error) {
            console.log(`Error encountered: ${error}`);
        } finally {
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
