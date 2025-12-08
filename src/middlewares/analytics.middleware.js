import apiLogs from "../models/apiLogs.model.js";

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
        console.log("Error in analytics middleware:", error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

export {
    getAnalytics,
}