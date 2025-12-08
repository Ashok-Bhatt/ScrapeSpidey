import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { TOKEN_SECRET } from "../config.js";
import handleError from "../utils/errorHandler.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req?.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Unauthenticated User! Token not provided" });

        const decodedToken = jwt.verify(token, TOKEN_SECRET);
        if (!decodedToken) return res.status(401).json({ message: "Unauthenticated User! Invalid Token!" });

        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        return handleError(res, error, "Error in auth middleware:");
    }
}

export {
    protectRoute,
}