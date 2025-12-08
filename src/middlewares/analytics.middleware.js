import apiLogs from "../models/apiLogs.model.js";
import handleError from "../utils/errorHandler.js";

const getAnalytics = async (req, res, next) => {
    try {
        const apiKey = req.apiKey || req.query.apiKey || "";
        const startTime = Date.now();

        res.on("finish", async () => {
            const duration = Date.now() - startTime;

            await apiLogs.create({
                apiKey: apiKey,
                endpoint: req.originalUrl,
                statusCode: res.statusCode,
                responseTime: duration,
                endpointCost: req.apiPointsCost || 0,
            });
        })

        next();
    } catch (error) {
        return handleError(res, error, "Error in analytics middleware:");
    }
}

export {
    getAnalytics,
}