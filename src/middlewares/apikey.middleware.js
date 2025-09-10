import User from "../models/user.model.js";
import ApiPoints from "../models/apiPoints.model.js";
import {DAILY_API_POINT_LIMIT} from "../constants.js"
import apiLogs from "../models/apiLogs.model.js";

const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || "";
        if (!apiKey) return res.status(401).json({message: "API Key Required!"});

        const user = await User.findOne({apiKey});

        if (user){
            const currentDate = new Date().toISOString().split("T")[0];

            let apiPointsModel = await ApiPoints.findOneAndUpdate(
                { apiKey, date: currentDate },
                { $inc: { remainingRequests: -1 } },
                { new: true }
            );

            // If still no requests left
            if (apiPointsModel && apiPointsModel.remainingRequests < 0) return res.status(429).json({ message: "Rate limit exceeded. Try again tomorrow." });

            // If no document exists, create it with daily limit - 1
            if (!apiPointsModel) {
                apiPointsModel = await ApiPoints.findOneAndUpdate(
                    { apiKey, date: currentDate },
                    { $setOnInsert: { remainingRequests: DAILY_API_POINT_LIMIT - 1 } },
                    { new: true, upsert: true }
                );
            }

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

        } else {
            return res.status(401).json({message: "Invalid API Key!"});
        }
    } catch (error) {
        console.log("Error in auth middleware:", error.message);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    verifyApiKey,
}