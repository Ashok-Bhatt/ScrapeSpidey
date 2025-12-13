import axios from "axios";
import handleError from "../../utils/errorHandler.js";
import { getNormalizedGfgHeatmap } from "../../utils/calendar.js";

const headers = {
    "Content-Type": "application/json",
    "Referer": "https://practice.geeksforgeeks.org",
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
}

const getUserSubmissions = async (req, res) => {
    try {
        const username = req.query.user;
        const year = parseInt(req.query.year) || new Date().getFullYear();

        if (!username) return res.status(400).json({ message: "Username not found" });

        const response = await axios.post("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", { handle: username, requestType: "getYearwiseUserSubmissions", year: year, month: "" }, { headers })
        const data = getNormalizedGfgHeatmap(response?.data?.result, year);

        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch user submissions data");
    }
}

export {
    getUserSubmissions
}