import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 8000;
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// console.log(process.env.NODE_ENV, process.env.PORT, process.env.BROWSERLESS_TOKEN, process.env.TOKEN_SECRET, process.env.MONGODB_URI);

export {
  PORT,
  NODE_ENV,
  BROWSERLESS_TOKEN,
  TOKEN_SECRET,
  MONGODB_URI,
};