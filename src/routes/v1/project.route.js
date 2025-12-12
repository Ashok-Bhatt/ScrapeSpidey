import { getProjects, getProjectById, deleteProject, updateProject, createProject, changeDailyApiLimit, getUserProjects } from "../../controllers/v1/project.controller.js";
import { Router } from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { adminCheck } from "../../middlewares/admin.middleware.js";

const router = Router();

// Admin Routes
router.route("/daily-api-limit").patch(protectRoute, adminCheck, changeDailyApiLimit);
router.route("/admin/user/:userId").get(protectRoute, adminCheck, getUserProjects);

// Project CRUD
router.route("/")
    .post(protectRoute, createProject)
    .get(protectRoute, getProjects);

router.route("/:id")
    .delete(protectRoute, deleteProject)
    .patch(protectRoute, updateProject)
    .get(protectRoute, getProjectById);

export { router };