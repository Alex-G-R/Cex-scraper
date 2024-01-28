
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;

import { link_array } from '../links/ps3gamesPL';
import { checkRobotsTxt } from '../common/scrape_utils';


export async function start_scraping_devel_pl(page_param: number) {

    const pathPS3 = `data/poland-page${page_param}-devel.txt`;

    const browser = await puppeteer.launch({
        headless: 'new',
    });

    const page = await browser.newPage();
    puppeteer.use(pluginStealth());
    const page_index = page_param - 1;
    try {
        await page.goto(link_array[page_index], { waitUntil: 'domcontentloaded' });
        console.log(link_array[page_index]);

        // Check if the URL is allowed by robots.txt before proceeding
        const isAllowed = await checkRobotsTxt(page);
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
        
        fs.appendFile(pathPS3, `${link_array[page_index]} \n`)
                .then(() => {
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                });
        for (let j = 0; j < prices.length; j++) {
            const price_exchaned = prices[j].slice(0, -2);
            const data = `${titles[j]}: ${parseFloat(price_exchaned)}`;
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
        return;
    } finally {
        await browser.close();
        console.log("The data has been saved to the yourdir/Cex-scraper/data");
        console.log("You may now close the program.");
        return;
    }
}

