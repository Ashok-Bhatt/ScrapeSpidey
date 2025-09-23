import { getAdminAnalytics } from "../controllers/admin.controller.js";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/analytics").get(protectRoute, adminCheck, getAdminAnalytics);

export {router};