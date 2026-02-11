import { getGithubBadges } from "../../controllers/v1/github.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/badges").get(verifyApiKey, rateLimiter, logApiUsage, getGithubBadges);

export { router };
