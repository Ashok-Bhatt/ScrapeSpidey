const adminCheck = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) return res.status(403).json({ message: "You are not authorized for this service" });
        next();
    } catch (error) {
        console.log("Error in admin middleware:", error.message);
        return res.status(500).json({ message: "Internal Sever Error!" });
    }
}

export {
    adminCheck,
}