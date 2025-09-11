import ApiPoints from "../models/apiPoints.model.js";
import {DAILY_API_POINT_LIMIT} from "../constants.js"

const checkLimit = async (req, res, next) => {
    try{
        const apiKey = req.query.apiKey;
        const currentDate = new Date().toISOString().split("T")[0];

        let apiPointsModel = await ApiPoints.findOne({ apiKey, date: currentDate});

        if (apiPointsModel){
            if (apiPointsModel.remainingApiPoints < 0) return res.status(429).json({ message: "Rate limit exceeded. Try again tomorrow." });

            apiPointsModel.remainingApiPoints = apiPointsModel.remainingApiPoints-1;
            apiPointsModel.requestsMade++;
            apiPointsModel.save();
            
            next();
        } else {
            apiPointsModel = await ApiPoints.create({
                apiKey, 
                date: currentDate,
                remainingApiPoints : DAILY_API_POINT_LIMIT - 1,
                requestsMade: 1,
            })

            if (!apiPointsModel) return res.status(400).json({message: "Something went wrong!"});
            next();
        }
    } catch (error) {
        console.log("Error in rateLimiter middleware:", error.message);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    checkLimit,
}