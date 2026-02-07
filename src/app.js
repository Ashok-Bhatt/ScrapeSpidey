import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as gfgRouter } from "./routes/v1/gfg.route.js";
import { router as codechefRouter } from "./routes/v1/codechef.route.js";
import { router as hackerrankRouter } from "./routes/v1/hackerrank.route.js";
import { router as code360Router } from "./routes/v1/code360.route.js";
import { router as interviewbitRouter } from "./routes/v1/interviewbit.route.js";
import { router as githubRouter } from "./routes/v1/github.route.js";
import { router as leetcodeRouter } from "./routes/v1/leetcode.route.js"
import { router as userRouter } from "./routes/v1/user.route.js";
import { router as analyticsRouter } from "./routes/v1/analytics.route.js";
import { router as newsRouter } from './routes/v1/news.route.js';
import { router as projectRouter } from "./routes/v1/project.route.js";
import { router as hackerrankRouter2 } from "./routes/v2/hackerrank.route.js";
import { router as interviewbitRouter2 } from "./routes/v2/interviewbit.route.js";
import { router as gfgRouter2 } from "./routes/v2/gfg.route.js";
import { CLIENT_URL } from "./config/env.config.js";

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

app.use("/api/v1/gfg", cors(publicCorsOptions), gfgRouter);
app.use("/api/v1/codechef", cors(publicCorsOptions), codechefRouter);
app.use("/api/v1/hackerrank", cors(publicCorsOptions), hackerrankRouter);
app.use("/api/v1/code360", cors(publicCorsOptions), code360Router);
app.use("/api/v1/interviewbit", cors(publicCorsOptions), interviewbitRouter);
app.use("/api/v1/leetcode", cors(publicCorsOptions), leetcodeRouter);
app.use("/api/v1/github", cors(publicCorsOptions), githubRouter);

app.use("/api/v2/hackerrank", cors(publicCorsOptions), hackerrankRouter2);
app.use("/api/v2/interviewbit", cors(publicCorsOptions), interviewbitRouter2);
app.use("/api/v2/gfg", cors(publicCorsOptions), gfgRouter2);

app.use("/api/v1/user", cors(restrictedCorsOptions), userRouter);
app.use("/api/v1/news", cors(publicCorsOptions), newsRouter);
app.use("/api/v1/analytics", cors(restrictedCorsOptions), analyticsRouter);
app.use("/api/v1/project", cors(restrictedCorsOptions), projectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to scrape spidey! Scrape data from your favorite coding profiles.")
})

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${message}`);
  if (err.stack) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export { app };
