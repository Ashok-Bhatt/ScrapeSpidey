import { Router } from "express";
import { getUserInfo } from "../controllers/interviewbit.controller.js";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"

const router = Router();

router.route("/user/:user").get(verifyApiKey, getUserInfo);

export {
    router,
}