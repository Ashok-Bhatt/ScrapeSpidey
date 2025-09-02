import { Router } from "express";
import { login, createAccount, logout, checkAuth } from "../controllers/user.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", createAccount);
router.post("/logout", logout);

// Protected routes
router.get("/auth/check", protectRoute, checkAuth);

export {
    router,
}