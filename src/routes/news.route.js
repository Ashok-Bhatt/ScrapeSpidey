import { createNews } from "../controllers/admin.controller.js";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(protectRoute, adminCheck, createNews);

export {router};