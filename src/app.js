import express from "express"
import { router as GfgRouter } from "./routes/gfg.route.js";
import { router as codechefRouter } from "./routes/codechef.route.js";
import { router as hackerrankRouter } from "./routes/hackerrank.route.js";
import { router as code360Router } from "./routes/code360.route.js";
import { router as interviewbitRouter } from "./routes/interviewbit.route.js"
import cors from "cors";

const app = express();
app.use(cors({origin : "*",}));
app.use("/api/v1/gfg", GfgRouter);
app.use("/api/v1/codechef", codechefRouter);
app.use("/api/v1/hackerrank", hackerrankRouter);
app.use("/api/v1/code360", code360Router);
app.use("/api/v1/interviewbit", interviewbitRouter);


app.get("/", (req, res)=>{
    res.send("Welcome to scrape spidey! Scrape data from your favorite coding profiles.")
})

export {app};