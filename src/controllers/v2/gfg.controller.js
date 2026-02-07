import axios from "axios";
import { asyncHandler } from "../../utils/async-handler.util.js";
import { getNormalizedGfgHeatmap } from "../../utils/calendar.util.js";

const headers = {
    "Content-Type": "application/json",
    "Referer": "https://practice.geeksforgeeks.org",
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
}

const getUserSubmissions = asyncHandler(async (req, res) => {
    const username = req.query.user;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    if (!username) return res.status(400).json({ message: "Username not found" });

    const response = await axios.post("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", { handle: username, requestType: "getYearwiseUserSubmissions", year: year, month: "" }, { headers })
    const data = getNormalizedGfgHeatmap(response?.data?.result, year);

    return res.status(200).json(data);
});

export {
    getUserSubmissions
}
