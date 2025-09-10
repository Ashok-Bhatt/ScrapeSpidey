import ApiPoints from "../models/apiPoints.model.js";
import {DAILY_API_POINT_LIMIT,} from "../constants.js"
import apiLogs from "../models/apiLogs.model.js";

const getDailyApiUsageData = async (req, res) => {
    try{
        const apiKey = req.query.apiKey;
        const date = req.query.date || new Date.now().toISOString().split("T")[0];

        const dailyUsageData = await ApiPoints.findOne({apiKey, date});

        if (!dailyUsageData){
            return res.status(200).json({
                apiKey : apiKey,
                date: date,
                remainingApiPoints: DAILY_API_POINT_LIMIT,
                requestsMade: 0,
            })   
        } else {
            return res.status(200).json(dailyUsageData);
        }
    } catch (error) {
        return res.status(500).json({message: "Something went wrong!"});
    }
}

const getRequestsData = async (req, res) => {
    try{
        const apiKey = req.query.apiKey;
        const previousInterval = req.query.previousInterval || 30*60*1000;

        const intervalEnding = Date.now();
        const intervalStarting = intervalEnding - previousInterval;

        const requestsData = apiLogs.find({apiKey, createdAt : {$gt : new Date(intervalStarting), $lt: new Date(intervalEnding)}});
        return res.status(200).json(requestsData);
    } catch (error){
        return res.status(500).json({message: "Something went wrong!"});
    }
}

export {
    getDailyApiUsageData,
    getRequestsData,
}