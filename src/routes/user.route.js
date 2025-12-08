import { Router } from "express";
import { login, createAccount, logout, checkAuth, changePassword, updateUserInfo, getUsers, uploadProfilePic, updateUserApiKey } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", createAccount);
router.post("/logout", logout);

// Protected routes
router.get("/check", protectRoute, checkAuth);
router.patch("/password", protectRoute, changePassword);
router.patch("/", protectRoute, updateUserInfo);
router.patch("/profile-pic", protectRoute, upload.single("profilePic"), uploadProfilePic)
router.patch("/api-key", protectRoute, updateUserApiKey);

// Admin Routes
router.get("/", protectRoute, adminCheck, getUsers);

export {
    router,
}