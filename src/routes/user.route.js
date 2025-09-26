import { Router } from "express";
import { login, createAccount, logout, checkAuth, changePassword, updateUserInfo } from "../controllers/user.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", createAccount);
router.post("/logout", logout);

// Protected routes
router.get("/check", protectRoute, checkAuth);
router.patch("/password", protectRoute, changePassword);
router.patch("/", protectRoute, updateUserInfo);

export {
    router,
}