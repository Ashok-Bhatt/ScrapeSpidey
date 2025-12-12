import axios from "axios";
import { LEETCODE_GRAPHQL_ENDPOINT, LEETCODE_GRAPHQL_QUERIES } from "../constants.js";

const makeLeetCodeRequest = async (query, variables = {}) => {
    try {
        const { data } = await axios.post(
            LEETCODE_GRAPHQL_ENDPOINT,
            { query, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Referer": "https://leetcode.com/",
                    "Origin": "https://leetcode.com/    ",
                    "User-Agent": "Mozilla/5.0",
                },
                timeout: 30000,
            }
        );

        return data.data;
    } catch (error) {
        console.log("Error occurred: ", error.message);
        console.log(error.stack);
        return null;
    }
};

export const fetchUserProfile = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userProfile, { username });
};

export const fetchLanguageStats = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userLanguageStats, { username });
};

export const fetchUserCalendar = async (username, year) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userProfileCalendar, { username, year });
};

export const fetchRecentAcSubmissions = async (username, limit = 10) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.recentAcSubmissions, { username, limit });
};

export const fetchUserBadges = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userBadges, { username });
};

export const fetchContestRanking = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userContestRankings, { username });
};

export const fetchSkillStats = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.skillStats, { username });
};

export const fetchUserProfileQuestionProgressV2 = async (userSlug) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userProfileUserQuestionProgressV2, { userSlug });
};

export const fetchUserSessionProgress = async (username) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.userSessionProgress, { username });
};

export const fetchContestRatingHistogram = async () => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.contestRatingHistogram, {});
};

export const fetchQuestionOfToday = async () => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.questionOfToday, {});
};

export const fetchCodingChallengeMedal = async (year, month) => {
    return await makeLeetCodeRequest(LEETCODE_GRAPHQL_QUERIES.codingChallengeMedal, { year, month });
};
