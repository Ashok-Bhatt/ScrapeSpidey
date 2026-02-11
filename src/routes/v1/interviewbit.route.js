import { Router } from "express";
import { getUserInfo, getUserSubmissions, getUserBadges } from "../../controllers/v1/interviewbit.controller.js";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserInfo);
router.route("/user/submissions").get(verifyApiKey, rateLimiter, logApiUsage, getUserSubmissions);
router.route("/user/badges").get(verifyApiKey, rateLimiter, logApiUsage, getUserBadges);

export {
    router,
}
