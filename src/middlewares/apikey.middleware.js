import Project from "../models/project.model.js";

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
        console.log("Error in api middleware:", error.message);
        console.log(error.stack);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

export {
    verifyApiKey,
}