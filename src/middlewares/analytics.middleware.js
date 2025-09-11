import apiLogs from "../models/apiLogs.model.js";

const getAnalytics = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || req.user.apiKey;
        const startTime = Date.now();

        res.on("finish", async ()=>{
            const duration = Date.now() - startTime;

            await apiLogs.create({
                apiKey : apiKey,
                endpoint: req.originalUrl,
                statusCode: res.statusCode,
                responseTime: duration,
                endpointCost: 1,
            });
        })

        next();
    } catch (error) {
        console.log("Error in analytics middleware:", error.message);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    getAnalytics,
}