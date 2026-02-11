import { getUserSubmissions } from "../../controllers/v2/gfg.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/submissions").get(verifyApiKey, rateLimiter, logApiUsage, getUserSubmissions);

export { router };
