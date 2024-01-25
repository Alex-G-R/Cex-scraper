export async function checkRobotsTxt(page) {
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
