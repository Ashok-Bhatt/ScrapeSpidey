import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {timestamps : true});

const News = mongoose.model("News", newsSchema);

export default News;