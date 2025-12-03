import puppeteer from "puppeteer";
import {NODE_ENV, PUPPETEER_EXECUTABLE_PATH } from "../config.js";

const configChromeDriver = async () => {
    return await puppeteer.launch({
        headless: NODE_ENV=="production" ? true : false,
        executablePath: PUPPETEER_EXECUTABLE_PATH,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-http2",
            "--disable-features=IsolateOrigins,site-per-process",
        ]
    });
}

const configBrowserPage = async (browser, url, waitUntilOption, waitSelector, waitForPageTime, waitForSelectorTime) => {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="120", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    });
    await page.goto(url, { waitUntil: waitUntilOption, timeout : waitForPageTime });
    await page.waitForSelector(waitSelector, { timeout: waitForSelectorTime });
    return page;
}

export {
    configChromeDriver,
    configBrowserPage,
}