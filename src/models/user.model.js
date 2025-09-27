import mongoose from "mongoose";
import { DAILY_API_POINT_LIMIT } from "../constants.js";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    profilePic: {
        type: String,
    },
    bio: {
        type: String,
        trim: true,
    },
    email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password : {
        type: String,
        required: true,
    },
    apiKey : {
        type: String,
        required: true,
    },
    apiPointsDailyLimit: {
        type: Number,
        default: DAILY_API_POINT_LIMIT,
    },
    isAdmin : {
        type: Boolean,
        default: false,
    }
}, {timestamps : true});

userSchema.index({createdAt: -1, _id:-1});

const User = mongoose.model("User", userSchema);

export default User;