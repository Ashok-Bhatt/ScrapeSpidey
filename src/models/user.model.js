import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
}, {timestamps : true});

const User = mongoose.model("User", userSchema);

export default User;