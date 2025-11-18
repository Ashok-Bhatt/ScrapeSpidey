import ApiPoints from "../models/apiPoints.model.js";
import {getApiCost} from "../utils/apiCost.js";

const checkLimit = async (req, res, next) => {
    try{
        const apiKey = req.query.apiKey;
        const dailyApiPointsLimit = req.apiPointsDailyLimit;
        const currentDate = new Date().toISOString().split("T")[0];

        let apiPointsModel = await ApiPoints.findOne({ apiKey, date: currentDate});

        if (apiPointsModel){
            if (apiPointsModel.apiPointsUsed >= dailyApiPointsLimit) return res.status(429).json({ message: "Rate limit exceeded. Try again tomorrow." });

            const apiPointsCost = getApiCost(req.originalUrl);

            apiPointsModel.apiPointsUsed = apiPointsModel.apiPointsUsed + apiPointsCost;
            apiPointsModel.requestsMade++;
            apiPointsModel.save();
            
            next();
        } else {

            const apiPointsCost = getApiCost(req.originalUrl);

            apiPointsModel = await ApiPoints.create({
                apiKey, 
                date: currentDate,
                apiPointsUsed : apiPointsCost,
                requestsMade: 1,
            })

            if (!apiPointsModel) return res.status(400).json({message: "Something went wrong!"});
            next();
        }
    } catch (error) {
        console.log("Error in rateLimiter middleware:", error.message);
        console.log(error.stack)
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    checkLimit,
}