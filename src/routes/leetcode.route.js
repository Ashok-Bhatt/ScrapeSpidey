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
router.route("/user/profile").post(verifyApiKey, checkLimit, getAnalytics, getUserProfile);
router.route("/user/language-stats").post(verifyApiKey, checkLimit, getAnalytics, getLanguageStats);
router.route("/user/calendar").post(verifyApiKey, checkLimit, getAnalytics, getUserCalendar);
router.route("/user/recent-submissions").post(verifyApiKey, checkLimit, getAnalytics, getRecentAcSubmissions);
router.route("/user/badges").post(verifyApiKey, checkLimit, getAnalytics, getUserBadges);
router.route("/user/contest-ranking").post(verifyApiKey, checkLimit, getAnalytics, getContestRanking);
router.route("/user/skill-stats").post(verifyApiKey, checkLimit, getAnalytics, getSkillStats);
router.route("/user/question-progress").post(verifyApiKey, checkLimit, getAnalytics, getUserProfileQuestionProgressV2);
router.route("/user/session-progress").post(verifyApiKey, checkLimit, getAnalytics, getUserSessionProgress);
router.route("/user/favorites").post(verifyApiKey, checkLimit, getAnalytics, getCreatedPublicFavoriteList);
router.route("/user/submission-permission").post(verifyApiKey, checkLimit, getAnalytics, getCanSeeOtherSubmissionHistory);
router.route("/user/active-badge").post(verifyApiKey, checkLimit, getAnalytics, getGetUserProfile);

// Global / miscellaneous endpoints
router.route("/global").post(verifyApiKey, checkLimit, getAnalytics, getGlobalData);
router.route("/contest/histogram").post(verifyApiKey, checkLimit, getAnalytics, getContestRatingHistogram);
router.route("/contest/yearly-medals").post(verifyApiKey, checkLimit, getAnalytics, getYearlyMedalsQualified);
router.route("/premium/features").post(verifyApiKey, checkLimit, getAnalytics, getPremiumBetaFeatures);
router.route("/streak").post(verifyApiKey, checkLimit, getAnalytics, getStreakCounter);
router.route("/timestamp").post(verifyApiKey, checkLimit, getAnalytics, getCurrentTimestamp);
router.route("/question/today").post(verifyApiKey, checkLimit, getAnalytics, getQuestionOfToday);
router.route("/coding-challenge/medal").post(verifyApiKey, checkLimit, getAnalytics, getCodingChallengeMedal);
router.route("/site/announcements").post(verifyApiKey, checkLimit, getAnalytics, getSiteAnnouncements);

export {router};