import { Router } from "express";
import { changeDailyApiLimit } from "../controllers/admin.controller.js";
import { adminCheck } from "../middlewares/admin.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// Admin Routes
router.patch("/daily-api-limit", protectRoute, adminCheck, changeDailyApiLimit)

export {
    router,
}