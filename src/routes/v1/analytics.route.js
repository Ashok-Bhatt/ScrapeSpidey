import { getDailyApiUsageData, getRequestsData, getAdminAnalytics } from "../../controllers/v1/analytics.controller.js";
import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { logApiUsage } from "../../middlewares/analytics.middleware.js";
import { adminCheck } from "../../middlewares/admin.middleware.js"

const router = Router();

router.route("/daily-usage").get(protectRoute, logApiUsage, getDailyApiUsageData);
router.route("/requests").get(protectRoute, logApiUsage, getRequestsData);
router.route("/admin-analytics").get(protectRoute, adminCheck, getAdminAnalytics);

export { router };
