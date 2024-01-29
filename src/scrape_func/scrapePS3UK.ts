
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;

import { link_array } from '../links/ps3gamesUK';
import { checkRobotsTxt } from '../common/scrape_utils';

const pathPS3 = "data/ps3UK.txt";

const kurs = 5.11;

export async function start_scraping_uk_ps3() {
    for (let i = 0; i < link_array.length; i++) {
        const browser = await puppeteer.launch({
            headless: 'new',
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

            await page.waitForSelector('.product-main-price', { timeout: 60000 });
            await page.waitForSelector('.card-title a', { timeout: 60000 });

            const titles = await page.$$eval('.card-title a', elements => {
                return elements.map(element => element.textContent.trim());
            });

            const prices = await page.$$eval('.product-main-price', elements => {
                return elements.map(element => element.textContent.trim());
            });
            
            fs.appendFile(pathPS3, `\n ${link_array[i]} \n`)
                    .then(() => {
                    })
                    .catch((error) => {
                        console.log(`Error: ${error}`);
                    });
            for (let j = 0; j < prices.length; j++) {
                const price_exchaned = prices[j].slice(1);
                const data = `${titles[j]}: ${prices[j]} -> ${(parseFloat(price_exchaned) * kurs).toFixed(2)}`;
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
            await page.waitForTimeout(Math.floor(Math.random() * 10000) + 25000);

        } catch (error) {
            console.log(`Error encountered: ${error}`);
        } finally {
            await browser.close();
        }
    }
    console.log("The data has been saved to the yourdir/Cex-scraper/data");
    console.log("You may now close the program.");
    return;
}


