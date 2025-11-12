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
import { router as adminRouter } from "./routes/admin.route.js";
import { router as newsRouter } from './routes/news.route.js';

const app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin: "*",
}));

app.use("/api/v1/gfg", GfgRouter);
app.use("/api/v1/codechef", codechefRouter);
app.use("/api/v1/hackerrank", hackerrankRouter);
app.use("/api/v1/code360", code360Router);
app.use("/api/v1/interviewbit", interviewbitRouter);
app.use("/api/v1/leetcode", leetcodeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/github", githubRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/news", newsRouter);

app.get("/", (req, res)=>{
    res.send("Welcome to scrape spidey! Scrape data from your favorite coding profiles.")
})

export {app};