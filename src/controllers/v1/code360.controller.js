import axios from "axios";
import handleError from "../../utils/errorHandler.js";
import { getNormalizedCode360Heatmap } from "../../utils/calendar.js";

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'https://www.code360.com/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
};

const getUserInfo = async (req, res) => {
    try {
        const username = req.query.user;
        const year = req.query.year || new Date().getFullYear();
        const includeContests = req.query.includeContests || false;
        const includeContributions = req.query.includeContributions || false;

        const userProfileResponse = await axios.get(`https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${username}&request_differentiator=${new Date()}&app_context=publicsection&naukri_request=true`, { headers });
        const userProfileData = userProfileResponse.data["data"];

        const userStreakResponse = await axios.get(`https://www.naukri.com/code360/api/v3/public_section/streaks/fetch_curr_and_long_streak?uuid=${userProfileData["uuid"]}&request_differentiator=${new Date()}&app_context=publicsection&naukri_request=true`, { headers });
        const userStreakData = userStreakResponse.data["data"];
        userProfileData["streaks"] = userStreakData;

        if (includeContests) {
            const userContestResponse = await axios.get(`https://www.naukri.com/code360/api/v3/public_section/user_rating_data?uuid=${userProfileData["uuid"]}&request_differentiator=${new Date()}&app_context=publicsection&naukri_request=true`, { headers });
            const userContestData = userContestResponse.data["data"];
            userProfileData["contests"] = userContestData;
        }

        if (includeContributions) {
            const userContributionsResponse = await axios.get(`https://www.naukri.com/code360/api/v3/public_section/profile/contributions?uuid=${userProfileData["uuid"]}&end_date=${new Date().toISOString()}&start_date=${new Date().toISOString()}&is_stats_required=true&unified=true&request_differentiator=${new Date()}&app_context=publicsection&naukri_request=true`, { headers });
            const userContributionsData = userContributionsResponse.data["data"];
            userContributionsData["contribution_map"] = getNormalizedCode360Heatmap(userContributionsData["contribution_map"], parseInt(year));
            userProfileData["contributions"] = userContributionsData;
        }

        return res.status(200).json(userProfileData);

    } catch (error) {
        return handleError(res, error, "Failed to fetch data");
    }
};

export {
    getUserInfo,
}