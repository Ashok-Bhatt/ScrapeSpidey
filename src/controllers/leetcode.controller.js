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
    fetchCreatedPublicFavoriteList,
    fetchCanSeeOtherSubmissionHistory,
    fetchGlobalData,
    fetchGetUserProfile,
    fetchContestRatingHistogram,
    fetchYearlyMedalsQualified,
    fetchPremiumBetaFeatures,
    fetchStreakCounter,
    fetchCurrentTimestamp,
    fetchQuestionOfToday,
    fetchCodingChallengeMedal,
    fetchSiteAnnouncements,
} from "../services/leetcode.service.js";

// Controller helpers - one endpoint per service function
const validateParam = (value) => value !== undefined && value !== null && value !== "";

const getUserProfile = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserProfile(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch LeetCode user profile." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch LeetCode user profile.", details: err.message });
    }
};

const getLanguageStats = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchLanguageStats(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch language statistics." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch language statistics.", details: err.message });
    }
};

const getUserCalendar = async (req, res) => {
    const username = req.query.user || req.query.username;
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserCalendar(username, year);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user calendar." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user calendar.", details: err.message });
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch recent accepted submissions.", details: err.message });
    }
};

const getUserBadges = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserBadges(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user badges." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user badges.", details: err.message });
    }
};

const getContestRanking = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchContestRanking(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest ranking." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch contest ranking.", details: err.message });
    }
};

const getSkillStats = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchSkillStats(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch skill stats." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch skill stats.", details: err.message });
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user question progress.", details: err.message });
    }
};

const getUserSessionProgress = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchUserSessionProgress(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user session progress." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user session progress.", details: err.message });
    }
};

const getCreatedPublicFavoriteList = async (req, res) => {
    const userSlug = req.query.userSlug || req.query.user;
    if (!validateParam(userSlug)) return res.status(400).json({ message: "userSlug not provided" });
    try {
        const data = await fetchCreatedPublicFavoriteList(userSlug);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user's public favorite lists." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user's public favorite lists.", details: err.message });
    }
};

const getCanSeeOtherSubmissionHistory = async (req, res) => {
    const userSlug = req.query.userSlug || req.query.user;
    if (!validateParam(userSlug)) return res.status(400).json({ message: "userSlug not provided" });
    try {
        const data = await fetchCanSeeOtherSubmissionHistory(userSlug);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not determine submission history permission." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not determine submission history permission.", details: err.message });
    }
};

const getGlobalData = async (req, res) => {
    try {
        const data = await fetchGlobalData();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch global data." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch global data.", details: err.message });
    }
};

const getGetUserProfile = async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    try {
        const data = await fetchGetUserProfile(username);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user active badge." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch user active badge.", details: err.message });
    }
};

const getContestRatingHistogram = async (req, res) => {
    try {
        const data = await fetchContestRatingHistogram();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest rating histogram." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch contest rating histogram.", details: err.message });
    }
};

const getYearlyMedalsQualified = async (req, res) => {
    const excludeAcquired = req.query.excludeAcquired === "true";
    try {
        const data = await fetchYearlyMedalsQualified(excludeAcquired);
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch yearly medals qualified." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch yearly medals qualified.", details: err.message });
    }
};

const getPremiumBetaFeatures = async (req, res) => {
    try {
        const data = await fetchPremiumBetaFeatures();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch premium beta features." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch premium beta features.", details: err.message });
    }
};

const getStreakCounter = async (req, res) => {
    try {
        const data = await fetchStreakCounter();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch streak counter." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch streak counter.", details: err.message });
    }
};

const getCurrentTimestamp = async (req, res) => {
    try {
        const data = await fetchCurrentTimestamp();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch current timestamp." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch current timestamp.", details: err.message });
    }
};

const getQuestionOfToday = async (req, res) => {
    try {
        const data = await fetchQuestionOfToday();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch question of today." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch question of today.", details: err.message });
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch coding challenge medal.", details: err.message });
    }
};

const getSiteAnnouncements = async (req, res) => {
    try {
        const data = await fetchSiteAnnouncements();
        if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch site announcements." });
        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong! Could not fetch site announcements.", details: err.message });
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
}