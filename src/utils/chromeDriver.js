import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer"
import {BROWSERLESS_TOKEN, NODE_ENV } from "../config.js";

const configChromeDriver = async () => {
    if (NODE_ENV == "development"){
        return await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
    } else {
        return await puppeteerCore.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_TOKEN}`,
        });
    }
}

export {
    configChromeDriver,
}