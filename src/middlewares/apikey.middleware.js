import User from "../models/user.model.js";

const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || "";
        if (!apiKey) return res.status(401).json({message: "API Key Required!"});

        const user = await User.findOne({apiKey});
        if (!user) return res.status(401).json({message: "Invalid API Key!"});

        req.apiPointsDailyLimit = user.apiPointsDailyLimit;
        next();
    } catch (error) {
        console.log("Error in api middleware:", error.message);
        console.log(error.stack);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export {
    verifyApiKey,
}