import ApiPoints from "../../models/apiPoints.model.js";
import apiLogs from "../../models/apiLogs.model.js";
import { DAILY_API_POINT_LIMIT } from "../../constants.js"
import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import handleError from "../../utils/errorHandler.js";

const getDailyApiUsageData = async (req, res) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) return res.status(400).json({ message: "API Key not provided" });

        const project = await Project.findOne({ apiKey });
        if (!project) return res.status(400).json({ message: "Project not found or invalid API Key" });

        if (project.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized access to this project" });

        const lastDays = req.query.lastDays || 1;

        if (lastDays > 30) return res.status(400).json({ message: "Too long history not allowed" });

        const today = new Date();
        const dailyUsageData = [];

        for (let i = 0; i < lastDays; i++) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            const dateData = await ApiPoints.findOne({ apiKey, date });
            if (dateData) {
                dailyUsageData.push(dateData);
            } else {
                const newDateData = await ApiPoints.create({
                    apiKey,
                    date,
                    remainingApiPoints: project.apiPointsDailyLimit || DAILY_API_POINT_LIMIT,
                    requestsMade: 0,
                })
                dailyUsageData.push(newDateData);
            }
        }

        return res.status(200).json(dailyUsageData);
    } catch (error) {
        return handleError(res, error, "Error in analytics controller:");
    }
}

const getRequestsData = async (req, res) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) return res.status(400).json({ message: "API Key not provided" });

        const project = await Project.findOne({ apiKey });
        if (!project) return res.status(400).json({ message: "Project not found or invalid API Key" });

        if (project.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized access to this project" });

        const previousInterval = parseInt(req.query.previousInterval) || 30 * 60 * 1000;

        // only last 30 days data fetching allowed
        if (previousInterval > 30 * 24 * 60 * 60 * 1000) return res.status(400).json({ message: "Too long history not allowed" });

        const intervalEnding = Date.now();
        const intervalStarting = intervalEnding - previousInterval;

        let requestsData = await apiLogs.find({ apiKey, createdAt: { $gt: new Date(intervalStarting), $lt: new Date(intervalEnding) }, endpoint: { $not: /^\/api\/v1\/analytics/ } });
        return res.status(200).json(requestsData);
    } catch (error) {
        return handleError(res, error, "Error in analytics controller:");
    }
}

const getAdminAnalytics = async (req, res) => {
    try {
        const { startInterval, endInterval } = req.query;

        if (!startInterval || !endInterval) return res.status(400).json({ message: "startInterval and endInterval are required" });

        const startDate = new Date(parseInt(startInterval));
        const endDate = new Date(parseInt(endInterval));

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return res.status(400).json({ message: "Invalid timestamp format" });
        if (startDate > endDate) return res.status(400).json({ message: "startInterval must be before endInterval" });

        // 1. Total active users of all time and users created in the given interval
        const totalUsersAllTime = await User.countDocuments();
        const usersCreatedInInterval = await User.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // 2. Total projects created (all time and in the given interval)
        const totalProjectsAllTime = await Project.countDocuments();
        const projectsCreatedInInterval = await Project.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // 3. Total requests made in the given interval (successful and unsuccessful count)
        const requestsInInterval = await apiLogs.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const successfulRequests = requestsInInterval.filter(log => log.statusCode >= 200 && log.statusCode < 300).length;
        const unsuccessfulRequests = requestsInInterval.filter(log => log.statusCode < 200 || log.statusCode >= 300).length;

        // 4. Endpoints analytics with average response time, count, and success/failure metrics
        const endpointAnalytics = await apiLogs.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $addFields: {
                    // Strip query parameters from endpoint
                    endpointWithoutQuery: {
                        $arrayElemAt: [{ $split: ["$endpoint", "?"] }, 0]
                    }
                }
            },
            {
                $group: {
                    _id: "$endpointWithoutQuery",
                    averageResponseTime: { $avg: "$responseTime" },
                    count: { $sum: 1 },
                    successfulCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $gte: ["$statusCode", 200] }, { $lt: ["$statusCode", 300] }] },
                                1,
                                0
                            ]
                        }
                    },
                    unsuccessfulCount: {
                        $sum: {
                            $cond: [
                                { $or: [{ $lt: ["$statusCode", 200] }, { $gte: ["$statusCode", 300] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $project: {
                    _id: 0,
                    endpoint: "$_id",
                    averageResponseTime: { $round: ["$averageResponseTime", 2] },
                    count: 1,
                    successfulCount: 1,
                    unsuccessfulCount: 1
                }
            }
        ]);

        // Prepare response
        const analyticsData = {
            users: {
                totalAllTime: totalUsersAllTime,
                createdInInterval: usersCreatedInInterval
            },
            projects: {
                totalAllTime: totalProjectsAllTime,
                createdInInterval: projectsCreatedInInterval
            },
            requests: {
                totalInInterval: requestsInInterval.length,
                successfulCount: successfulRequests,
                unsuccessfulCount: unsuccessfulRequests
            },
            endpointAnalytics: endpointAnalytics,
            interval: {
                start: startDate.toISOString(),
                end: endDate.toISOString()
            }
        };

        return res.status(200).json(analyticsData);
    } catch (error) {
        return handleError(res, error, "Error in getAdminAnalytics:");
    }
};

export {
    getDailyApiUsageData,
    getRequestsData,
    getAdminAnalytics,
}