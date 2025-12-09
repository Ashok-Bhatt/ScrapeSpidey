import { createNews, getAllNews, updateNews, deleteNews } from "../controllers/news.controller.js";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/admin.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/")
    .post(protectRoute, adminCheck, upload.single("newsImage"), createNews)
    .get(getAllNews)
    .delete(protectRoute, adminCheck, deleteNews)
    .patch(protectRoute, adminCheck, upload.single("newsImage"), updateNews);

export { router };