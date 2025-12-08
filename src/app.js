import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as GfgRouter } from "./routes/gfg.route.js";
import { router as codechefRouter } from "./routes/codechef.route.js";
import { router as hackerrankRouter } from "./routes/hackerrank.route.js";
import { router as code360Router } from "./routes/code360.route.js";
import { router as interviewbitRouter } from "./routes/interviewbit.route.js";
import { router as githubRouter } from "./routes/github.route.js";
import { router as leetcodeRouter } from "./routes/leetcode.route.js"
import { router as userRouter } from "./routes/user.route.js";
import { router as analyticsRouter } from "./routes/analytics.route.js";
import { router as newsRouter } from './routes/news.route.js';
import { router as ProjectRouter } from "./routes/project.route.js";

import { CLIENT_URL } from "./config.js";

const app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicCorsOptions = {
  origin: "*",
};

const restrictedCorsOptions = {
  origin: CLIENT_URL,
  credentials: true,
};

app.use("/api/v1/gfg", cors(publicCorsOptions), GfgRouter);
app.use("/api/v1/codechef", cors(publicCorsOptions), codechefRouter);
app.use("/api/v1/hackerrank", cors(publicCorsOptions), hackerrankRouter);
// app.use("/api/v1/code360", cors(publicCorsOptions), code360Router);
app.use("/api/v1/interviewbit", cors(publicCorsOptions), interviewbitRouter);
app.use("/api/v1/leetcode", cors(publicCorsOptions), leetcodeRouter);
app.use("/api/v1/github", cors(publicCorsOptions), githubRouter);
app.use("/api/v1/news", cors(publicCorsOptions), newsRouter);

app.use("/api/v1/user", cors(restrictedCorsOptions), userRouter);
app.use("/api/v1/analytics", cors(restrictedCorsOptions), analyticsRouter);
app.use("/api/v1/project", cors(restrictedCorsOptions), ProjectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to scrape spidey! Scrape data from your favorite coding profiles.")
})

export { app };