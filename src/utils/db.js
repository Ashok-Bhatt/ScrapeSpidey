import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};