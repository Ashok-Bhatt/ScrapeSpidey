import ApiPoints from "../models/api-points.model.js";
import Project from "../models/project.model.js";
import { getApiCost } from "../utils/api-cost.util.js";
import { DAILY_API_POINT_LIMIT } from "../constants/index.js"
import { asyncHandler } from "../utils/async-handler.util.js";

const rateLimiter = asyncHandler(async (req, res, next) => {
    const { apiKey } = req.query;
    if (!apiKey) return res.status(401).json({ message: "API Key required" });

    const project = await Project.findOne({ apiKey });
    if (!project) return res.status(401).json({ message: "Invalid API Key" });

    const apiCost = getApiCost(req.originalUrl);
    const date = new Date().toISOString().split("T")[0];

    let apiPoint = await ApiPoints.findOne({ apiKey, date });

    if (!apiPoint) {
        apiPoint = await ApiPoints.create({
            apiKey,
            date,
            remainingApiPoints: (project.apiPointsDailyLimit || DAILY_API_POINT_LIMIT) - apiCost,
            requestsMade: 1,
        })

        if (!apiPointsModel) return res.status(400).json({ message: "Something went wrong!" });
        next();
    }
});

export {
    rateLimiter,
}
