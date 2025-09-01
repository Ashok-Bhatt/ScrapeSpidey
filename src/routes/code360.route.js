import { getUserInfo } from "../controllers/code360.controller.js";
import { Router } from "express";

const router = Router();

router.route("/user/:user").get(getUserInfo);

export {router};