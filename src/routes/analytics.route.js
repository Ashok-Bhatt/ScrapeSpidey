import { getDailyApiUsageData, getRequestsData } from "../controllers/analytics.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"
import { getAnalytics } from "../middlewares/analytics.middleware.js";

const router = Router();

router.route("/daily-usage").get(verifyApiKey, getAnalytics, getDailyApiUsageData);
router.route("/requests/").get(verifyApiKey, getAnalytics, getRequestsData);

export {router};