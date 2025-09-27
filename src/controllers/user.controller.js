import User from "../models/user.model.js";
import {v4 as uuid} from "uuid"
import { generateToken } from "../utils/tokenGenerator.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const createAccount = async (req, res) => {

    try {
        const {email, password, name} = req.body;

        if (!email || !password || !name) return res.status(400).json({message : "All fields are required"});
        if (!isValidPassword(password)) return res.status(400).json({message : "Invalid Password"});
        if (!isValidEmail(email)) return res.status(400).json({message : "Invalid email"});

        const user = await User.findOne({email});
        if (user) return res.status(400).json({message : "User with this email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email : email,
            password :hashedPassword,
            apiKey: uuid(),
        })

        if (newUser){
            const token = generateToken(newUser._id, res);
            await newUser.save();

            const userResponse = newUser.toObject();
            delete userResponse.password;

            return res.status(201).json({
                token : token,
                user : userResponse,
            })
        } else {
            return res.status(400).json({message : "Something Went Wrong! User not created!"});
        }
    } catch (error){
        console.log("Error while creating user:", error.message);
        return res.status(500).json({message : "Something Went Wrong! User not created!"});
    }
}

const login = async (req, res) => {

    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({message : "All fields are required"});

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message : "Invalid email"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(404).json({message : "Wrong password"});

        const token = generateToken(user._id, res);
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            token : token,
            user : userResponse,
        });
    } catch (error) {
        console.log("Error while login:", error.message);
        return res.status(500).json({message : "Something Went Wrong! Login Unsuccessful!"});
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0});
        return res.status(200).json({message: "Logged out successfully"});
    } catch (error){
        console.log("Error while logout:", error.message);
        return res.status(500).json({message : "Something Went Wrong! Logout Unsuccessful!"});
    }
}

const checkAuth = (req, res) => {
    try{
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error while Checking user authentication:", error.message);
        return res.status(500).json({message : "Something Went Wrong! Couldn't check user authentication!"});
    }
}

const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) return res.status(400).json({ message: "All fields are required" });
        if (!isValidPassword(newPassword)) return res.status(400).json({ message: "Invalid new password format" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error while changing password:", error.message);
        return res.status(500).json({ message: "Something went wrong while updating password" });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { name, bio } = req.body;

        if (!name && !bio) return res.status(400).json({ message: "At least one field is required to update" });

        const user = await User.findById(req.user.id);
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
    } catch (error) {
        console.log("Error while updating user info:", error.message);
        return res.status(500).json({ message: "Something went wrong while updating user info" });
    }
};

const changeDailyApiLimit = async (req, res) => {
    try {
        const {userId, newApiPointsDailyLimit} = req.body;

        if (!userId) return res.status(400).json({message: "User Id not provided!"});
        if (!newApiPointsDailyLimit) return res.status(400).json({message: "API Limit not provided!"});

        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        if (!user) return res.status(404).json({message: "User not found!"});

        user.apiPointsDailyLimit = newApiPointsDailyLimit;
        user.save();

        return res.status(200).json({message: "Daily API Points Limit Changed!"});
    } catch (error) {
        console.log("Error occurred while changing he daily Api limit of the user");
        console.log(error.stack);
        return res.status(500).json({message: "Something went wrong while changing Daily API Points Limit!"});
    }   
}

const getUsers = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        let cursor = null;

        if (req.query.cursor){
            try {
                cursor = JSON.parse(decodeURIComponent(req.query.cursor));
            } catch (error) {
                return res.status(400).json({message: "Invalid cursor format"});
            }
        }

        let query = {};
        if (cursor){
            query = {
                $or : [
                    {createdAt: {$lt: new Date(cursor.createdAt)}},
                    {createdAt: new Date(cursor.createdAt), _id: { $lt: new mongoose.Types.ObjectId(cursor._id) }}
                ]
            };
        }

        const users = await User.find(query).sort({createdAt: -1, _id: -1}).limit(limit+1);
        const hasNext = users.length > limit;
        const pageUsers = hasNext ? users.slice(0, limit) : users;
        const nextCursor = hasNext ? pageUsers[pageUsers.length - 1] : null;

        res.status(200).json({
            users: pageUsers, 
            nextCursor : nextCursor ? encodeURIComponent(JSON.stringify(nextCursor)) : null,
            hasNext
        });
    } catch (error){
        console.log("Something went wrong while fetching users", error.message);
        console.log(error.stack);
        return null;
    }
}

export {
    createAccount,
    login,
    logout,
    checkAuth,
    changePassword,
    updateUserInfo,
    changeDailyApiLimit,
    getUsers,
}