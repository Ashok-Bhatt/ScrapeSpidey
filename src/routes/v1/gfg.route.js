import { getUserInfo, getUserSubmissions, getInstitutionInfo, getInstitutionTopThreeRankedUsers, getUserProblemsSolved } from "../../controllers/v1/gfg.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserInfo);
router.route("/user/problems").get(verifyApiKey, rateLimiter, logApiUsage, getUserProblemsSolved);
router.route("/user/submissions").get(verifyApiKey, rateLimiter, logApiUsage, getUserSubmissions);
router.route("/institution/top-3").get(verifyApiKey, rateLimiter, logApiUsage, getInstitutionTopThreeRankedUsers);
// router.route("/institution/info").get(verifyApiKey, rateLimiter, logApiUsage, getInstitutionInfo);

export { router };
