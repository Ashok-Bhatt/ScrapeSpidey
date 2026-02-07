import { getUserProfile, getLanguageStats, getUserCalendar, getRecentAcSubmissions, getUserBadges, getContestRanking, getSkillStats, getUserProfileQuestionProgressV2, getUserSessionProgress, getContestRatingHistogram, getQuestionOfToday, getCodingChallengeMedal } from "../../controllers/v1/leetcode.controller.js";
import { Router } from "express";
import { verifyApiKey } from "../../middlewares/api-key.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";

const router = Router();

// User-scoped endpoints
router.route("/user/profile").get(verifyApiKey, rateLimiter, logApiUsage, getUserProfile);
router.route("/user/language-stats").get(verifyApiKey, rateLimiter, logApiUsage, getLanguageStats);
router.route("/user/calendar").get(verifyApiKey, rateLimiter, logApiUsage, getUserCalendar);
router.route("/user/recent-submissions").get(verifyApiKey, rateLimiter, logApiUsage, getRecentAcSubmissions);
router.route("/user/badges").get(verifyApiKey, rateLimiter, logApiUsage, getUserBadges);
router.route("/user/contest-ranking").get(verifyApiKey, rateLimiter, logApiUsage, getContestRanking);
router.route("/user/skill-stats").get(verifyApiKey, rateLimiter, logApiUsage, getSkillStats);
router.route("/user/question-progress").get(verifyApiKey, rateLimiter, logApiUsage, getUserProfileQuestionProgressV2);
router.route("/user/session-progress").get(verifyApiKey, rateLimiter, logApiUsage, getUserSessionProgress);

// Global / miscellaneous endpoints
router.route("/contest/histogram").get(verifyApiKey, rateLimiter, logApiUsage, getContestRatingHistogram);
router.route("/question/today").get(verifyApiKey, rateLimiter, logApiUsage, getQuestionOfToday);
router.route("/coding-challenge/medal").get(verifyApiKey, rateLimiter, logApiUsage, getCodingChallengeMedal);

export { router };
