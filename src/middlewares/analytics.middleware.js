import apiLogs from "../models/api-logs.model.js";
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
                statusCode: res.statusCode,
                responseTime: duration,
                endpointCost: getApiCost(req.originalUrl),
            });
        }
    });

    next();
});

export {
    logApiUsage,
}
