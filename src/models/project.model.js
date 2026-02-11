import mongoose from "mongoose";
import { DAILY_API_POINT_LIMIT } from "../constants/index.js";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    apiKey: {
        type: String,
        required: true,
    },
    apiPointsDailyLimit: {
        type: Number,
        default: DAILY_API_POINT_LIMIT,
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
