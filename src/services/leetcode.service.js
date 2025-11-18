import axios from "axios";
import { LEETCODE_GRAPHQL_ENDPOINT, LEETCODE_GRAPHQL_QUERIES } from "../constants.js";

const makeGraphQLRequest = async (query, variables = {}) => {
    try {
        const {data} = await axios.post(
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
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userProfile, { username });
};

export const fetchLanguageStats = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userLanguageStats, { username });
};

export const fetchUserCalendar = async (username, year) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userProfileCalendar, { username, year });
};

export const fetchRecentAcSubmissions = async (username, limit = 10) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.recentAcSubmissions, { username, limit });
};

export const fetchUserBadges = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userBadges, { username });
};

export const fetchContestRanking = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userContestRankings, { username });
};

export const fetchSkillStats = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.skillStats, { username });
};

export const fetchUserProfileQuestionProgressV2 = async (userSlug) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userProfileUserQuestionProgressV2, { userSlug });
};

export const fetchUserSessionProgress = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.userSessionProgress, { username });
};

export const fetchCreatedPublicFavoriteList = async (userSlug) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.createdPublicFavoriteList, { userSlug });
};

export const fetchCanSeeOtherSubmissionHistory = async (userSlug) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.canSeeOtherSubmissionHistory, { userSlug });
};

export const fetchGlobalData = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.globalData, {});
};

export const fetchGetUserProfile = async (username) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.getUserProfile, { username });
};

export const fetchContestRatingHistogram = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.contestRatingHistogram, {});
};

export const fetchYearlyMedalsQualified = async (excludeAcquired = false) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.yearlyMedalsQualified, { excludeAcquired });
};

export const fetchPremiumBetaFeatures = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.premiumBetaFeatures, {});
};

export const fetchStreakCounter = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.getStreakCounter, {});
};

export const fetchCurrentTimestamp = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.currentTimestamp, {});
};

export const fetchQuestionOfToday = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.questionOfToday, {});
};

export const fetchCodingChallengeMedal = async (year, month) => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.codingChallengeMedal, { year, month });
};

export const fetchSiteAnnouncements = async () => {
    return await makeGraphQLRequest(LEETCODE_GRAPHQL_QUERIES.siteAnnouncements, {});
};
