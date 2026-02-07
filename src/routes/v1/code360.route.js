import { getUserInfo, getUserSubmissions } from "../../controllers/v1/code360.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js";
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserInfo);
router.route("/user/submission").get(verifyApiKey, rateLimiter, logApiUsage, getUserSubmissions);

export { router };
