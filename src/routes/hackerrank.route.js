import { Router } from "express";
import { getUserInfo } from "../controllers/hackerrank.controller.js";

const router = Router();

router.route("/user/:user").get(getUserInfo);

export {
    router,
}