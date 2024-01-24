const express = require('express');

import { start_scraping_pl_ps3 } from "./scrapePS3PL";
import { start_scraping_uk_ps3 } from "./scrapePS3UK";
import { start_scraping_uk_ps3a } from "./test";

const app = express();
const PORT = 6969;

async function startScraping() {
    try {
        // Call the first function and wait for it to complete
        await start_scraping_uk_ps3a();

        // Call the second function after the first one is finished
        //await start_scraping_pl_ps3();

        // Continue with any further processing or handling
    } catch (error) {
        console.error("Error while scraping:", error.message);
    }
}

startScraping();


const server = app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
