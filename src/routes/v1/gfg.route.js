import { getUserInfo, getUserSubmissions, getInstitutionInfo, getInstitutionTopThreeRankedUsers, getUserProblemsSolved } from "../../controllers/v1/gfg.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apikey.middleware.js"
import { checkLimit } from "../../middlewares/rateLimiter.middleware.js";
import { getAnalytics } from "../../middlewares/analytics.middleware.js";

const router = Router();

router.route("/user/profile").get(verifyApiKey, checkLimit, getAnalytics, getUserInfo);
router.route("/user/problems").get(verifyApiKey, checkLimit, getAnalytics, getUserProblemsSolved);
router.route("/user/submissions").get(verifyApiKey, checkLimit, getAnalytics, getUserSubmissions);
router.route("/institution/top-3").get(verifyApiKey, checkLimit, getAnalytics, getInstitutionTopThreeRankedUsers);
// router.route("/institution/info").get(verifyApiKey, checkLimit, getAnalytics, getInstitutionInfo);

export { router };