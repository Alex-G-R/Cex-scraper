
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;

import { link_array_UK } from './links/ps3gamesUK';

const pathPS3 = "data/ps3UK.txt";

export async function start_scraping_uk_ps3() {
    for (let i = 0; i < link_array_UK.length; i++) {
        const browser = await puppeteer.launch({
            // headless: false,
        });

        const page = await browser.newPage();
        puppeteer.use(pluginStealth());

        try {
            await page.goto(link_array_UK[i], { waitUntil: 'domcontentloaded' });
            console.log(link_array_UK[i]);

            // Check if the URL is allowed by robots.txt before proceeding
            const isAllowed = await checkRobotsTxtUKPS3(page);
            if (!isAllowed) {
                console.log('Access to the current URL is disallowed by robots.txt. Skipping...');
                continue;
            }

            await page.waitForSelector('.product-main-price', { timeout: 50000 });
            await page.waitForSelector('.card-title a', { timeout: 50000 });

            const titles = await page.$$eval('.card-title a', elements => {
                return elements.map(element => element.textContent.trim());
            });

            const prices = await page.$$eval('.product-main-price', elements => {
                return elements.map(element => element.textContent.trim());
            });
            
            fs.appendFile(pathPS3, `${link_array_UK[i]} \n`)
                    .then(() => {
                    })
                    .catch((error) => {
                        console.log(`Error: ${error}`);
                    });
            for (let j = 0; j < prices.length; j++) {
                const data = `${titles[j]}: ${prices[j]}`;
                console.log(data);
                fs.appendFile(pathPS3, data+"\n")
                    .then(() => {
                    })
                    .catch((error) => {
                        console.log(`Error: ${error}`);
                    });
            }
            console.log(`\n`);

            // Introduce random delays between requests
            await page.waitForTimeout(Math.floor(Math.random() * 10000) + 20000);

        } catch (error) {
            console.log(`Error encountered: ${error}`);
        } finally {
            await browser.close();
        }
    }
}


export async function checkRobotsTxtUKPS3(page) {
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
