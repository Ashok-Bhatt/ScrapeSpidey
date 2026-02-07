import mongoose from "mongoose";

const apiPointsSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    apiPointsUsed: {
        type: Number,
        default: 0,
    },
    requestsMade: {
        type: Number,
        default: 0,
    }
});

apiPointsSchema.index({ apiKey: 1, date: 1 }, { unique: true });

const ApiPoints = mongoose.model("ApiPoints", apiPointsSchema);

export default ApiPoints;
