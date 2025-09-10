import { getUserInfo } from "../controllers/code360.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js";
import {checkLimit} from "../middlewares/rateLimiter.middleware.js";
import {getAnalytics} from "../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/:user").get(verifyApiKey, checkLimit, getAnalytics, getUserInfo);

export {router};