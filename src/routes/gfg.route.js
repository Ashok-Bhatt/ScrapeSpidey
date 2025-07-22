import { getUserInfo } from "../controllers/gfg.controller.js";
import { Router } from "express";

const router = Router();

router.route("/user/:user").get(getUserInfo);

export {router};