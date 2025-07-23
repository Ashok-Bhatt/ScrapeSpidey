import 'dotenv/config'

const PORT = process.env.PORT || 8000;
const NODE_ENV = "production"
const PUPPETEER_EXECUTABLE_PATH = NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath();

export {
    PORT,
    NODE_ENV,
    PUPPETEER_EXECUTABLE_PATH,
}