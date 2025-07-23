import 'dotenv/config';
import puppeteer from 'puppeteer';

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

const PUPPETEER_EXECUTABLE_PATH = NODE_ENV === "production"
  ? 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
  : puppeteer.executablePath();

export {
  PORT,
  NODE_ENV,
  PUPPETEER_EXECUTABLE_PATH,
};