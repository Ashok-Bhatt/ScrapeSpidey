import Project from "../models/project.model.js";
import { asyncHandler } from "../utils/async-handler.util.js";

const verifyApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.query.apiKey || "";
    const projectId = req.query.projectId || "";

    let project = null;
    if (apiKey) project = await Project.findOne({ apiKey });
    else if (projectId) project = await Project.findById(projectId);

    if (!project) {
        return res.status(401).json({ message: "Invalid API Key or Project Id!" });
    }

    req.apiKey = project.apiKey;
    req.apiPointsDailyLimit = project.apiPointsDailyLimit;
    next();
});

export {
    verifyApiKey,
}
