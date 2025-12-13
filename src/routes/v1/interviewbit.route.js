import { Router } from "express";
import { getUserInfo, getUserSubmissions } from "../../controllers/v1/interviewbit.controller.js";
import { verifyApiKey } from "../../middlewares/apikey.middleware.js"
import { checkLimit } from "../../middlewares/rateLimiter.middleware.js";
import { getAnalytics } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, checkLimit, getAnalytics, getUserInfo);
router.route("/user/submissions").get(verifyApiKey, checkLimit, getAnalytics, getUserSubmissions);
router.route("/user/badges").get(verifyApiKey, checkLimit, getAnalytics, getUserBadges);

export {
    router,
}