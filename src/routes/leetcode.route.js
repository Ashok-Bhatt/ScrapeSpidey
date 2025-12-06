import {
	getUserProfile,
	getLanguageStats,
	getUserCalendar,
	getRecentAcSubmissions,
	getUserBadges,
	getContestRanking,
	getSkillStats,
	getUserProfileQuestionProgressV2,
	getUserSessionProgress,
	getContestRatingHistogram,
	getQuestionOfToday,
	getCodingChallengeMedal,
} from "../controllers/leetcode.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"
import {checkLimit} from "../middlewares/rateLimiter.middleware.js";
import {getAnalytics} from "../middlewares/analytics.middleware.js";

const router = Router();

// User-scoped endpoints
router.route("/user/profile").get(verifyApiKey, checkLimit, getAnalytics, getUserProfile);
router.route("/user/language-stats").get(verifyApiKey, checkLimit, getAnalytics, getLanguageStats);
router.route("/user/calendar").get(verifyApiKey, checkLimit, getAnalytics, getUserCalendar);
router.route("/user/recent-submissions").get(verifyApiKey, checkLimit, getAnalytics, getRecentAcSubmissions);
router.route("/user/badges").get(verifyApiKey, checkLimit, getAnalytics, getUserBadges);
router.route("/user/contest-ranking").get(verifyApiKey, checkLimit, getAnalytics, getContestRanking);
router.route("/user/skill-stats").get(verifyApiKey, checkLimit, getAnalytics, getSkillStats);
router.route("/user/question-progress").get(verifyApiKey, checkLimit, getAnalytics, getUserProfileQuestionProgressV2);
router.route("/user/session-progress").get(verifyApiKey, checkLimit, getAnalytics, getUserSessionProgress);

// Global / miscellaneous endpoints
router.route("/contest/histogram").get(verifyApiKey, checkLimit, getAnalytics, getContestRatingHistogram);
router.route("/question/today").get(verifyApiKey, checkLimit, getAnalytics, getQuestionOfToday);
router.route("/coding-challenge/medal").get(verifyApiKey, checkLimit, getAnalytics, getCodingChallengeMedal);

export {router};