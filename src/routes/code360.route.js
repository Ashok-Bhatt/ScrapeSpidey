import { getUserInfo } from "../controllers/code360.controller.js";
import { Router } from "express";
import {verifyApiKey} from "../middlewares/apikey.middleware.js"

const router = Router();

router.route("/user/:user").get(verifyApiKey, getUserInfo);

export {router};