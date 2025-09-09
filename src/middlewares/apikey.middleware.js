import User from "../models/user.model.js";

const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.query.apiKey || "";
        console.log(req.query);
        if (!apiKey) return res.status(401).json({message: "API Key Required!"});

        const user = await User.findOne({apiKey});
        if (user) next();
        else return res.status(401).json({message: "Invalid API Key!"});
    } catch (error) {
        console.log("Error in auth middleware:", error.message);
        return res.status(500).json({message: "Internal Sever Error!"});
    }
}

export {
    verifyApiKey,
}