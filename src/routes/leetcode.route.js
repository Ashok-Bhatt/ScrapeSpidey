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
	getCreatedPublicFavoriteList,
	getCanSeeOtherSubmissionHistory,
	getGlobalData,
	getGetUserProfile,
	getContestRatingHistogram,
	getYearlyMedalsQualified,
	getPremiumBetaFeatures,
	getStreakCounter,
	getCurrentTimestamp,
	getQuestionOfToday,
	getCodingChallengeMedal,
	getSiteAnnouncements,
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
router.route("/user/favorites").get(verifyApiKey, checkLimit, getAnalytics, getCreatedPublicFavoriteList);
router.route("/user/submission-permission").get(verifyApiKey, checkLimit, getAnalytics, getCanSeeOtherSubmissionHistory);
router.route("/user/active-badge").get(verifyApiKey, checkLimit, getAnalytics, getGetUserProfile);

// Global / miscellaneous endpoints
router.route("/global").get(verifyApiKey, checkLimit, getAnalytics, getGlobalData);
router.route("/contest/histogram").get(verifyApiKey, checkLimit, getAnalytics, getContestRatingHistogram);
router.route("/contest/yearly-medals").get(verifyApiKey, checkLimit, getAnalytics, getYearlyMedalsQualified);
router.route("/premium/features").get(verifyApiKey, checkLimit, getAnalytics, getPremiumBetaFeatures);
router.route("/streak").get(verifyApiKey, checkLimit, getAnalytics, getStreakCounter);
router.route("/timestamp").get(verifyApiKey, checkLimit, getAnalytics, getCurrentTimestamp);
router.route("/question/today").get(verifyApiKey, checkLimit, getAnalytics, getQuestionOfToday);
router.route("/coding-challenge/medal").get(verifyApiKey, checkLimit, getAnalytics, getCodingChallengeMedal);
router.route("/site/announcements").get(verifyApiKey, checkLimit, getAnalytics, getSiteAnnouncements);

export {router};