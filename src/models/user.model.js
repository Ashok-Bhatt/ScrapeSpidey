import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
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
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    apiKey: {
        type: String,
    }
}, { timestamps: true });

userSchema.index({ createdAt: -1, _id: -1 });

const User = mongoose.model("User", userSchema);

export default User;