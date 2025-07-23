import 'dotenv/config';
import puppeteer, { executablePath } from 'puppeteer';

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

const PUPPETEER_EXECUTABLE_PATH = NODE_ENV === "production"
  ? 'https://github.com/Sparticuz/chromium/releases/download/v138.0.2/chromium-v138.0.2-pack.tar'
  : puppeteer.executablePath();

export {
  PORT,
  NODE_ENV,
  PUPPETEER_EXECUTABLE_PATH,
};