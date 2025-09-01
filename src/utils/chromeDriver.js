import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer"
import {BROWSERLESS_TOKEN, NODE_ENV } from "../config.js";

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
        return await puppeteerCore.connect({
            browserWSEndpoint: `wss://production-sfo.browserless.io?token=${BROWSERLESS_TOKEN}&--disable-http2=true&--disable-features=IsolateOrigins,site-per-process`,
        });

    }
}

export {
    configChromeDriver,
}