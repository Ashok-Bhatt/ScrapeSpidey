import handleError from "../utils/errorHandler.js";

const adminCheck = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) return res.status(403).json({ message: "You are not authorized for this service" });
        next();
    } catch (error) {
        return handleError(res, error, "Error in admin middleware:");
    }
}

export {
    adminCheck,
}