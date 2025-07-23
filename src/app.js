import express from "express"
import { router as GfgRouter } from "./routes/gfg.route.js";
import cors from "cors";

const app = express();
app.use(cors({origin : "*",}));
app.use("/api/v1/gfg", GfgRouter);

app.get("/", (req, res)=>{
    res.send("Welcome to scrape spidey! Scrape data from your favorite websites.")
})

export {app};