import Project from "../models/project.model.js";
import handleError from "../utils/errorHandler.js";

const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || "";
        const projectId = req.query.projectId || "";

        let project = null;
        if (apiKey) project = await Project.findOne({ apiKey });
        else if (projectId) project = await Project.findById(projectId);

        if (!project) return res.status(401).json({ message: "Invalid API Key or Project Id!" });

        req.apiKey = project.apiKey;
        req.apiPointsDailyLimit = project.apiPointsDailyLimit;
        next();
    } catch (error) {
        return handleError(res, error, "Error in api middleware:");
    }
}

export {
    verifyApiKey,
}