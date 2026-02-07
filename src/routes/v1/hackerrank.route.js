import { Router } from "express";
import { getUserInfo } from "../../controllers/v1/hackerrank.controller.js";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserInfo);

export {
    router,
}
