import { getUserInfo, getUserSubmissions } from "../controllers/codechef.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"

const router = Router();

router.route("/user/:user").get(verifyApiKey, getUserInfo);
router.route("/user/submissions/:user").get(verifyApiKey, getUserSubmissions);

export {router};