import { getUserInfo, getUserSubmissions } from "../controllers/gfg.controller.js";
import { Router } from "express";

const router = Router();

router.route("/user/:user").get(getUserInfo);
router.route("/user/submissions/:user").get(getUserSubmissions);

export {router};