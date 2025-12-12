import {
    fetchUserProfile,
    fetchLanguageStats,
    fetchUserCalendar,
    fetchRecentAcSubmissions,
    fetchUserBadges,
    fetchContestRanking,
    fetchSkillStats,
    fetchUserProfileQuestionProgressV2,
    fetchUserSessionProgress,
    fetchContestRatingHistogram,
    fetchQuestionOfToday,
    fetchCodingChallengeMedal,
} from "../../services/leetcode.service.js";
import { getNormalizedLeetCodeHeatmap } from "../../utils/calendar.js";
import handleError from "../../utils/errorHandler.js";

// Controller helpers - one endpoint per service function
const validateParam = (value) => value !== undefined && value !== null && value !== "";

const getUserProfile = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserProfile(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch LeetCode user profile." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getLanguageStats = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchLanguageStats(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch language statistics." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getUserCalendar = async (req, res) => {
    const username = req.query.user || req.query.username;
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserCalendar(username, year);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user calendar." });
        data["matchedUser"]["userCalendar"]["submissionCalendar"] = getNormalizedLeetCodeHeatmap(JSON.parse(data["matchedUser"]["userCalendar"]["submissionCalendar"]), year);
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getRecentAcSubmissions = async (req, res) => {
    const username = req.query.user || req.query.username;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchRecentAcSubmissions(username, limit);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch recent accepted submissions." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getUserBadges = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserBadges(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user badges." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getContestRanking = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchContestRanking(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest ranking." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getSkillStats = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchSkillStats(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch skill stats." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

// Additional controllers for the remaining service functions
const getUserProfileQuestionProgressV2 = async (req, res) => {
    const userSlug = req.query.userSlug || req.query.user;
    if (!validateParam(userSlug)) return res.status(400).json({ message: "userSlug not provided" });
    try {
        const data = await fetchUserProfileQuestionProgressV2(userSlug);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user question progress." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getUserSessionProgress = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserSessionProgress(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user session progress." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getContestRatingHistogram = async (req, res) => {
    try {
        const data = await fetchContestRatingHistogram();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest rating histogram." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getQuestionOfToday = async (req, res) => {
    try {
        const data = await fetchQuestionOfToday();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch question of today." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getCodingChallengeMedal = async (req, res) => {
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    if (Number.isNaN(year) || Number.isNaN(month)) return res.status(400).json({ message: "year and month query params are required and must be integers" });
    try {
        const data = await fetchCodingChallengeMedal(year, month);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch coding challenge medal." });
        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

export {
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
}