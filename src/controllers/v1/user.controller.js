import User from "../../models/user.model.js";
import { generateToken } from "../../utils/token-generator.util.js";
import { isValidEmail, isValidPassword } from "../../utils/validation.util.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { destroyFile, uploadFile } from "../../utils/cloudinary.util.js";
import { asyncHandler } from "../../utils/async-handler.util.js";

const createAccount = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) return res.status(400).json({ message: "All fields are required" });
    if (!isValidPassword(password)) return res.status(400).json({ message: "Invalid Password" });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User with this email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
    })

    if (newUser) {
        const token = generateToken(newUser._id, res);
        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            token: token,
            user: userResponse,
        })
    } else {
        return res.status(400).json({ message: "Something Went Wrong! User not created!" });
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid email" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(404).json({ message: "Wrong password" });

    const token = generateToken(user._id, res);
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
        token: token,
        user: userResponse,
    });
});

const logout = asyncHandler((req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
});

const checkAuth = asyncHandler((req, res) => {
    return res.status(200).json(req.user);
});

const changePassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "All fields are required" });
    if (!isValidPassword(newPassword)) return res.status(400).json({ message: "Invalid new password format" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
});

const updateUserInfo = asyncHandler(async (req, res) => {
    const { name, bio } = req.body;

    if (!name && !bio) return res.status(400).json({ message: "At least one field is required to update" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bio) user.bio = bio;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
        message: "User info updated successfully",
        user: userResponse,
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    let cursor = null;

    if (req.query.cursor) {
        try {
            cursor = JSON.parse(decodeURIComponent(req.query.cursor));
        } catch (error) {
            return res.status(400).json({ message: "Invalid cursor format" });
        }
    }

    let query = {};
    if (cursor) {
        query = {
            $or: [
                { createdAt: { $lt: new Date(cursor.createdAt) } },
                { createdAt: new Date(cursor.createdAt), _id: { $lt: new mongoose.Types.ObjectId(cursor._id) } }
            ]
        };
    }

    const users = await User.find(query).sort({ createdAt: -1, _id: -1 }).limit(limit + 1);
    const hasNext = users.length > limit;
    const pageUsers = hasNext ? users.slice(0, limit) : users;
    const nextCursor = hasNext ? pageUsers[pageUsers.length - 1] : null;

    res.status(200).json({
        users: pageUsers,
        nextCursor: nextCursor ? encodeURIComponent(JSON.stringify(nextCursor)) : null,
        hasNext
    });
});

const uploadProfilePic = asyncHandler(async (req, res) => {
    const user = req.user;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No image file provided" });

    const oldProfilePicUrl = user.profilePic;
    const newProfilePicUrl = await uploadFile(file.path, "ScrapeSpidey");

    if (!newProfilePicUrl) return res.status(400).json({ message: "Could not upload new profile image" });

    user.profilePic = newProfilePicUrl;
    await user.save();

    if (oldProfilePicUrl) await destroyFile(oldProfilePicUrl);

    res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: newProfilePicUrl,
    });
});

const updateUserApiKey = asyncHandler(async (req, res) => {
    const { apiKey } = req.body;
    const user = req.user;

    if (apiKey === undefined) return res.status(400).json({ message: "API Key is required" });

    user.apiKey = apiKey;
    await user.save();

    return res.status(200).json({ message: "Default API Key updated successfully", apiKey: user.apiKey });
});

export {
    createAccount,
    login,
    logout,
    checkAuth,
    changePassword,
    updateUserInfo,
    getUsers,
    uploadProfilePic,
    updateUserApiKey,
}
