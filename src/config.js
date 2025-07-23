import 'dotenv/config';
import puppeteer from 'puppeteer';

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

const PUPPETEER_EXECUTABLE_PATH = NODE_ENV === "production"
  ? process.env.PUPPETEER_EXECUTABLE_PATH
  : puppeteer.executablePath();

export {
  PORT,
  NODE_ENV,
  PUPPETEER_EXECUTABLE_PATH,
};