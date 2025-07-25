import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 8000;
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;

export {
  PORT,
  NODE_ENV,
  BROWSERLESS_TOKEN,
};