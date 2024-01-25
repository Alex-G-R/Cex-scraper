const express = require('express');
const prompt = require("prompt-sync")({ sigint: true });

import { start_scraping_pl_ps3 } from "./scrape_func/scrapePS3PL";
import { start_scraping_uk_ps3 } from "./scrape_func/scrapePS3UK";
import { start_scraping_devel_pl } from "./scrape_func/scrapeDevelPoland";
import { start_scraping_devel_uk } from "./scrape_func/scrapeDevelUK";

const app = express();
const PORT = 6969;

async function startScraping() {

    const decision_one = menu_one();
    if(decision_one == 1)
    { // UK handle
        try {
            await start_scraping_uk_ps3();
        } catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if(decision_one == 2)
    { // PL handle
        try {
            await start_scraping_pl_ps3();
        } catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if(decision_one == 3)
    { // Devel scrape (individual page scrape)
        const decision_devel_one = menu_devel();
        if(decision_devel_one == 1)
        { // UK devel handle
            const page_num = menu_devel_page();
            start_scraping_devel_uk(page_num);
        }
        else if (decision_devel_one == 2)
        { // PL devel handle
            const page_num = menu_devel_page();
            start_scraping_devel_pl(page_num);
        }
        else
        {
            // Try again
            //startScraping();
        }
    }
    else 
    {
        // Try again
        //startScraping();
    }
}

function menu_one()
{
    console.log("Hey, what server would you like to scrape? ");
    console.log("Unitied Kingdom -> 1");
    console.log("Poland -> 2");
    console.log("PL/UK Devel -> 3");
    const option = prompt("Please choose one option: ");
    return option;
}

function menu_devel()
{
    console.log("Hey, what server would you like to scrape? ");
    console.log("Unitied Kingdom -> 1");
    console.log("Poland -> 2");
    const option = prompt("Please choose one option: ");
    return option;
}

function menu_devel_page()
{
    console.log("Hey, what page number would you like to scrape? ");
    const option = prompt("Please provide the page number: ");
    return option;
}

startScraping();


const server = app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
