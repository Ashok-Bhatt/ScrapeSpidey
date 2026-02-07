import puppeteer from "puppeteer";
import { NODE_ENV, PUPPETEER_EXECUTABLE_PATH } from "../config.js";

let browserInstance = null;

const initBrowser = async () => {
    if (browserInstance) return browserInstance;

    try {
        let launchOptions = {};

        if (NODE_ENV === "production") {
            launchOptions = {
                headless: "new",
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--disable-http2",
                    "--disable-features=IsolateOrigins,site-per-process",
                    "--single-process",
                    "--no-zygote",
                ]
            };
            if (PUPPETEER_EXECUTABLE_PATH) {
                launchOptions.executablePath = PUPPETEER_EXECUTABLE_PATH;
            }
        } else {
            launchOptions = {
                headless: "new",
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                ]
            };
        }

        console.log("Launching new browser instance...");
        browserInstance = await puppeteer.launch(launchOptions);

        browserInstance.on("disconnected", () => {
            console.log("Browser disconnected.");
            browserInstance = null;
        });

        return browserInstance;
    } catch (error) {
        console.error("Failed to launch browser:", error.message);
        throw error;
    }
};

const getBrowser = async () => {
    if (!browserInstance) {
        await initBrowser();
    }
    return browserInstance;
};

const closeBrowser = async () => {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
};

export {
    initBrowser,
    getBrowser,
    closeBrowser
};
