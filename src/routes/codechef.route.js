import { getUserInfo, getUserSubmissions } from "../controllers/codechef.controller.js";
import { Router } from "express";

const router = Router();

router.route("/user/:user").get(getUserInfo);
router.route("/user/submissions/:user").get(getUserSubmissions);

export {router};