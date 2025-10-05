import { getUserInfo, getUserSubmissions } from "../controllers/gfg.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"
import {checkLimit} from "../middlewares/rateLimiter.middleware.js";
import {getAnalytics} from "../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, checkLimit, getAnalytics, getUserInfo);
router.route("/user/submissions").get(verifyApiKey, checkLimit, getAnalytics, getUserSubmissions);

export {router};