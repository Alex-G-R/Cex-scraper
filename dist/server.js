"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const prompt = require("prompt-sync")({ sigint: true });
const bodyParser = require('body-parser');
const scrapePS3PL_1 = require("./scrape_func/scrapePS3PL");
const scrapePS3UK_1 = require("./scrape_func/scrapePS3UK");
const scrapeDevelPL_1 = require("./scrape_func/scrapeDevelPL");
const scrapeDevelUK_1 = require("./scrape_func/scrapeDevelUK");
const server_utils_1 = require("./common/server_utils");
const app = express();
const PORT = 6969;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));
console.log("Do you want to use the terminal version or the web gui version?");
console.log("1 -> Terminal version.");
console.log("2 -> Web gui version.");
const mode = prompt("Please choose one option: ");
if (parseInt(mode) === 1) {
    startScraping();
}
else if (parseInt(mode) === 2) {
    console.log("Open the web-browser of choice and go to 'localhost:6969'.");
    app.get('/', (req, res) => {
        console.log("User connected.");
        res.render('index');
    });
    // Define route to handle form submission
    app.post('/submit', (req, res) => {
        const selecter_server = req.body.selectServer;
        const fullscrape_checked = req.body.fullscrape === 'on';
        const page_to_scrape = req.body.pageNumber;
        console.log(`${selecter_server}, ${fullscrape_checked}, ${page_to_scrape}`);
        if (selecter_server == "uk_server" && fullscrape_checked === true) {
            (0, scrapePS3UK_1.start_scraping_uk_ps3)();
            res.send("The data will be sent to the ....../Cex-scraper/data \n Go back to the console to see the real-time progress");
        }
        else if (selecter_server == "pl_server" && fullscrape_checked === true) {
            (0, scrapePS3PL_1.start_scraping_pl_ps3)();
            res.send("The data will be sent to the ....../Cex-scraper/data \n Go back to the console to see the real-time progress");
        }
        else if (selecter_server == "uk_server" && fullscrape_checked === false) {
            (0, scrapeDevelUK_1.start_scraping_devel_uk)(parseInt(page_to_scrape));
            res.send("The data will be sent to the ....../Cex-scraper/data \n Go back to the console to see the real-time progress");
        }
        else if (selecter_server == "pl_server" && fullscrape_checked === false) {
            (0, scrapeDevelPL_1.start_scraping_devel_pl)(parseInt(page_to_scrape));
            res.send("The data will be sent to the ....../Cex-scraper/data \n Go back to the console to see the real-time progress");
        }
        else {
            res.send("Error while starting the scrape.");
            throw "Error while starting the scrape.";
        }
    });
}
else {
    throw "This option does not exist.";
}
async function startScraping() {
    const decision_one = (0, server_utils_1.menu_one)();
    if (parseInt(decision_one) == 1) { // UK handle
        try {
            await (0, scrapePS3UK_1.start_scraping_uk_ps3)();
        }
        catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if (parseInt(decision_one) == 2) { // PL handle
        try {
            await (0, scrapePS3PL_1.start_scraping_pl_ps3)();
        }
        catch (error) {
            console.error("Error while scraping:", error.message);
        }
    }
    else if (parseInt(decision_one) == 3) { // Devel scrape (individual page scrape)
        const decision_devel_one = (0, server_utils_1.menu_devel)();
        if (parseInt(decision_devel_one) == 1) { // UK devel handle
            const page_num = (0, server_utils_1.menu_devel_page)();
            (0, scrapeDevelUK_1.start_scraping_devel_uk)(parseInt(page_num));
        }
        else if (parseInt(decision_devel_one) == 2) { // PL devel handle
            const page_num = (0, server_utils_1.menu_devel_page)();
            (0, scrapeDevelPL_1.start_scraping_devel_pl)(parseInt(page_num));
        }
        else {
            // Try again
            //startScraping();
        }
    }
    else {
        // Try again
        //startScraping();
    }
}
//# sourceMappingURL=server.js.map