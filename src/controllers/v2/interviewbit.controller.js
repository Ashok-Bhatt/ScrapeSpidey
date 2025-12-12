import axios from "axios";
import handleError from "../../utils/errorHandler.js";
import { getNormalizedInterviewBitHeatmap } from "../../utils/calendar.js"

const getUserInfo = async (req, res) => {
    try {
        const username = req.query.user;

        const userProfileResponse = await axios.get(`https://www.interviewbit.com/v2/profile/username?id=${username}`);
        const userProfileData = userProfileResponse.data;

        const problemsSolvedResponse = await axios.get(`https://www.interviewbit.com/v2/problem_list/problems_solved_overview_count?username=${username}`);
        const problemsSolvedData = problemsSolvedResponse.data;

        const submissionAnalysisResponse = await axios.get(`https://www.interviewbit.com/v2/profile/username/submission-analysis/?id=${username}`);
        const submissionAnalysisData = submissionAnalysisResponse.data;

        delete userProfileData.is_friend;
        delete userProfileData.id;

        return res.status(200).json({ profile: userProfileData, problems: problemsSolvedData, submissionAnalysis: submissionAnalysisData });
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

const getUserSubmissions = async (req, res) => {
    try {
        const username = req.query.user;
        const year = req.query.year || new Date().getFullYear();

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://www.interviewbit.com/',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
        };

        const response = await axios.get(`https://www.interviewbit.com/v2/profile/username/daily-user-submissions/${year}/?id=${username}`, { headers });

        const data = response.data;

        const heatmapData = {};

        for (let i = 0; i < data.length; i++) {
            heatmapData[data[i].date] = data[i].count;
        }

        const normalizedHeatmapData = getNormalizedInterviewBitHeatmap(heatmapData, parseInt(year));

        return res.status(200).json(normalizedHeatmapData);
    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
}

export {
    getUserInfo,
    getUserSubmissions,
}