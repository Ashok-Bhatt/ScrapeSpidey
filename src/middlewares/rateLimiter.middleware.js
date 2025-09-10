import ApiPoints from "../models/apiPoints.model.js";
import {DAILY_API_POINT_LIMIT} from "../constants.js"

const checkLimit = async (req, res, next) => {
    try{
        const apiKey = req.query.apiKey;
        const currentDate = new Date().toISOString().split("T")[0];

        let apiPointsModel = await ApiPoints.findOneAndUpdate(
            { apiKey, date: currentDate },
            { $inc: { remainingApiPoints: -1, requestsMade: 1 }, },
            { new: true }
        );

        // If still no requests left
        if (apiPointsModel && apiPointsModel.remainingApiPoints < 0) return res.status(429).json({ message: "Rate limit exceeded. Try again tomorrow." });

        // If no document exists, create it with daily limit - 1
        if (!apiPointsModel) {
            apiPointsModel = await ApiPoints.findOneAndUpdate(
                { apiKey, date: currentDate },
                { $setOnInsert: { remainingApiPoints: DAILY_API_POINT_LIMIT - 1, requestsMade: 1 } },
                { new: true, upsert: true }
            );
        }

        console.log("ratelimiter");
        next();
    } catch (error) {
        console.log("Error in rateLimiter middleware:", error.message);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    checkLimit,
}