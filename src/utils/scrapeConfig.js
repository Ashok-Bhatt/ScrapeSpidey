import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {BROWSERLESS_TOKEN, NODE_ENV } from "../config.js";

puppeteer.use(StealthPlugin());

const configChromeDriver = async () => {
    if (NODE_ENV == "development"){
        return await puppeteer.launch({
            headless: false,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-http2",
                "--disable-features=IsolateOrigins,site-per-process",
            ]
        });
    } else {
        return await puppeteer.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_TOKEN}&--disable-http2=true&--disable-features=IsolateOrigins,site-per-process&stealth`,
        });
    }
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