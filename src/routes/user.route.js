import { Router } from "express";
import { login, createAccount, logout, checkAuth, changePassword, updateUserInfo, getUsers, uploadProfilePic, updateUserApiKey } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes
router.route("/login").post(login);
router.route("/signup").post(createAccount);
router.route("/logout").post(logout);

// Protected routes
router.route("/check").get(protectRoute, checkAuth);
router.route("/password").patch(protectRoute, changePassword);
router.route("/").patch(protectRoute, updateUserInfo);
router.route("/profile-pic").patch(protectRoute, upload.single("profilePic"), uploadProfilePic);
router.route("/api-key").patch(protectRoute, updateUserApiKey);

// Admin Routes
router.route("/").get(protectRoute, adminCheck, getUsers);

export { router };