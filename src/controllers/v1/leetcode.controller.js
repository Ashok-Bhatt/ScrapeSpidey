import axios from "axios";
import { LEETCODE_GRAPHQL_ENDPOINT, LEETCODE_GRAPHQL_QUERIES } from "../../constants/index.js";
import { getNormalizedLeetCodeHeatmap } from "../../utils/calendar.util.js";
import { asyncHandler } from "../../utils/async-handler.util.js";

// Helper for making LeetCode GraphQL requests
const makeApiCall = async (query, variables = {}) => {
    try {
        const { data } = await axios.post(
            LEETCODE_GRAPHQL_ENDPOINT,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Referer": "https://leetcode.com/",
                    "Origin": "https://leetcode.com/",
                    "User-Agent": "Mozilla/5.0",
                },
                timeout: 30000,
            }
        );
        return data.data;
    } catch (error) {
        console.error("LeetCode Request Error: ", error.message);
        return null;
    }
};

const validateParam = (value) => value !== undefined && value !== null && value !== "";

const getUserProfile = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userProfile, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch LeetCode user profile." });
    return res.status(200).json(data);
});

const getLanguageStats = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userLanguageStats, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch language statistics." });
    return res.status(200).json(data);
});

const getUserCalendar = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userProfileCalendar, { username, year });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user calendar." });

    if (data["matchedUser"]?.["userCalendar"]?.["submissionCalendar"]) {
        data["matchedUser"]["userCalendar"]["submissionCalendar"] = getNormalizedLeetCodeHeatmap(
            JSON.parse(data["matchedUser"]["userCalendar"]["submissionCalendar"]),
            year
        );
    }

    return res.status(200).json(data);
});

const getRecentAcSubmissions = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.recentAcSubmissions, { username, limit });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch recent accepted submissions." });
    return res.status(200).json(data);
});

const getUserBadges = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userBadges, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user badges." });

    data["matchedUser"]?.["badges"]?.forEach((badge) => {
        badge["icon"] = badge["icon"].startsWith("http") ? badge["icon"] : "https://leetcode.com" + badge["icon"];
    });

    return res.status(200).json(data);
});

const getContestRanking = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userContestRankings, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest ranking." });
    return res.status(200).json(data);
});

const getSkillStats = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.skillStats, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch skill stats." });
    return res.status(200).json(data);
});

const getUserProfileQuestionProgressV2 = asyncHandler(async (req, res) => {
    const userSlug = req.query.userSlug || req.query.user;
    if (!validateParam(userSlug)) return res.status(400).json({ message: "userSlug not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userProfileUserQuestionProgressV2, { userSlug });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user question progress." });
    return res.status(200).json(data);
});

const getUserSessionProgress = asyncHandler(async (req, res) => {
    const username = req.query.user || req.query.username;
    if (!validateParam(username)) return res.status(400).json({ message: "Username not provided" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.userSessionProgress, { username });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch user session progress." });
    return res.status(200).json(data);
});

const getContestRatingHistogram = asyncHandler(async (req, res) => {
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.contestRatingHistogram, {});
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch contest rating histogram." });
    return res.status(200).json(data);
});

const getQuestionOfToday = asyncHandler(async (req, res) => {
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.questionOfToday, {});
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch question of today." });
    return res.status(200).json(data);
});

const getCodingChallengeMedal = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);
    if (Number.isNaN(year) || Number.isNaN(month)) return res.status(400).json({ message: "year and month query params are required and must be integers" });
    const data = await makeApiCall(LEETCODE_GRAPHQL_QUERIES.codingChallengeMedal, { year, month });
    if (!data) return res.status(500).json({ message: "Something went wrong! Could not fetch coding challenge medal." });
    return res.status(200).json(data);
});

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