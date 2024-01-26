"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu_devel_page = exports.menu_devel = exports.menu_one = void 0;
const prompt = require("prompt-sync")({ sigint: true });
function menu_one() {
    console.log("Hey, what server would you like to scrape? ");
    console.log("Unitied Kingdom -> 1");
    console.log("Poland -> 2");
    console.log("PL/UK Devel -> 3");
    const option = prompt("Please choose one option: ");
    return option;
}
exports.menu_one = menu_one;
function menu_devel() {
    console.log("Hey, what server would you like to scrape? ");
    console.log("Unitied Kingdom -> 1");
    console.log("Poland -> 2");
    const option = prompt("Please choose one option: ");
    return option;
}
exports.menu_devel = menu_devel;
function menu_devel_page() {
    console.log("Hey, what page number would you like to scrape? ");
    const option = prompt("Please provide the page number: ");
    return option;
}
exports.menu_devel_page = menu_devel_page;
//# sourceMappingURL=server_utils.js.map