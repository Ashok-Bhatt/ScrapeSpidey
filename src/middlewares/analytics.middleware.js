import apiLogs from "../models/api-logs.model.js";
import ApiPoints from "../models/api-points.model.js";
import Project from "../models/project.model.js";
import { getApiCost } from "../utils/api-cost.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";

const logApiUsage = asyncHandler(async (req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
        const duration = Date.now() - start;
        const { apiKey } = req.query;

        if (apiKey) {
            await apiLogs.create({
                apiKey,
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                responseTime: duration,
                ip: req.ip,
                pointsUsed: getApiCost(req.originalUrl),
            });
        }
    });

    next();
});

export {
    logApiUsage,
}
