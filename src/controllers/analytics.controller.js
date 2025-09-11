import ApiPoints from "../models/apiPoints.model.js";
import {DAILY_API_POINT_LIMIT,} from "../constants.js"
import apiLogs from "../models/apiLogs.model.js";

const getDailyApiUsageData = async (req, res) => {
    try{
        const apiKey = req.query.apiKey || req.user.apiKey;
        const lastDays = req.query.lastDays || 1;

        if (lastDays > 30) return res.status(400).json({message : "Too long history not allowed"});

        const today = new Date(); 
        const beginningDay = new Date(today.getTime() - (lastDays - 1) * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

        const dailyUsageData = await ApiPoints.find({apiKey, date: {$gte: beginningDay}});
        return res.status(200).json(dailyUsageData);
    } catch (error) {
        console.log("Error in analytics controller:", error);
        return res.status(500).json({message: "Something went wrong!"});
    }
}

const getRequestsData = async (req, res) => {
    try{
        const apiKey = req.query.apiKey || req.user.apiKey;
        const previousInterval = parseInt(req.query.previousInterval) || 30*60*1000;

        // only last 30 days data fetching allowed
        if (previousInterval > 30*24*60*60*1000) return res.status(400).json({message : "Too long history not allowed"});

        const intervalEnding = Date.now();
        const intervalStarting = intervalEnding - previousInterval;

        const requestsData = await apiLogs.find({apiKey, createdAt : {$gt : new Date(intervalStarting), $lt: new Date(intervalEnding)}});
        return res.status(200).json(requestsData);
    } catch (error){
        console.log("Error in analytics controller:", error);
        return res.status(500).json({message: "Something went wrong!"});
    }
}

export {
    getDailyApiUsageData,
    getRequestsData,
}