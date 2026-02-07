import { Router } from "express";
import { getUserInfo, getUserSubmissions } from "../../controllers/v2/interviewbit.controller.js";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserInfo);
router.route("/user/submissions").get(verifyApiKey, rateLimiter, logApiUsage, getUserSubmissions);

export {
    router,
}
