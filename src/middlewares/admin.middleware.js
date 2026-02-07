import { asyncHandler } from "../utils/async-handler.util.js";

const adminCheck = asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user || !user.isAdmin) return res.status(403).json({ message: "You are not authorized for this service" });
    next();
});

export {
    adminCheck,
}
