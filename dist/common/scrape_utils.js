"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRobotsTxt = void 0;
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
exports.checkRobotsTxt = checkRobotsTxt;
//# sourceMappingURL=scrape_utils.js.map