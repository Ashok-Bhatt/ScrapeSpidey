import { getUserInfo } from "../controllers/codechef.controller.js";
import { Router } from "express";

const router = Router();

router.route("/user/:user").get(getUserInfo);

export {router};