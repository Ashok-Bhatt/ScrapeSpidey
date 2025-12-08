import { getProjects, getProjectById, deleteProject, updateProject, createProject, changeDailyApiLimit } from "../controllers/project.controller.js";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(protectRoute, createProject);
router.route("/").get(protectRoute, getProjects);
router.route("/:id").delete(protectRoute, deleteProject);
router.route("/:id").patch(protectRoute, updateProject);
router.route("/:id").get(protectRoute, getProjectById);

// Admin Routes
router.patch("/daily-api-limit", protectRoute, adminCheck, changeDailyApiLimit);

export { router };