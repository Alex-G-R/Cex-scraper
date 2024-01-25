const express = require('express');
const prompt = require("prompt-sync")({ sigint: true });

import { start_scraping_pl_ps3 } from "./scrape_func/scrapePS3PL";
import { start_scraping_uk_ps3 } from "./scrape_func/scrapePS3UK";
import { start_scraping_devel_pl } from "./scrape_func/scrapeDevelPL";
import { start_scraping_devel_uk } from "./scrape_func/scrapeDevelUK";
import { menu_one, menu_devel, menu_devel_page } from './common/index_utils';

const app = express();
const PORT = 6969;

async function startScraping() {

    const decision_one = menu_one();
    if(parseInt(decision_one) == 1)
    { // UK handle
        try {
            await start_scraping_uk_ps3();
        } catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if(parseInt(decision_one) == 2)
    { // PL handle
        try {
            await start_scraping_pl_ps3();
        } catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if(parseInt(decision_one) == 3)
    { // Devel scrape (individual page scrape)
        const decision_devel_one = menu_devel();
        if(parseInt(decision_devel_one) == 1)
        { // UK devel handle
            const page_num = menu_devel_page();
            start_scraping_devel_uk(parseInt(page_num));
        }
        else if (parseInt(decision_devel_one) == 2)
        { // PL devel handle
            const page_num = menu_devel_page();
            start_scraping_devel_pl(parseInt(page_num));
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


startScraping();


const server = app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
