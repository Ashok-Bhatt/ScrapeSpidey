import axios from "axios";
import handleError from "../../utils/errorHandler.js";
import { getNormalizedGfgHeatmap } from "../../utils/calendar.js";

const getUserSubmissions = async (req, res) => {
    try {
        const username = req.query.user;
        const year = req.query.year || new Date().getFullYear().toString();
        const yearInt = parseInt(year, 10);

        if (!username) return res.status(400).json({ message: "Username not found" });

        const response = await axios.post("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", { handle: username, requestType: "getYearwiseUserSubmissions", year: yearInt, month: "" })
        const data = getNormalizedGfgHeatmap(response?.data?.result, yearInt);

        return res.status(200).json(data);
    } catch (error) {
        return handleError(res, error, "Failed to fetch user submissions data");
    }
}

export {
    getUserSubmissions
}