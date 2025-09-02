import User from "../models/user.model.js";
import {v4 as uuid} from "uuid"
import { generateToken } from "../utils/tokenGenerator.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";
import bcrypt from "bcryptjs";

const createAccount = async (req, res) => {

    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({message : "All fields are required"});
        if (!isValidPassword(password)) return res.status(400).json({message : "Invalid Password"});
        if (!isValidEmail(email)) return res.status(400).json({message : "Invalid email"});

        const user = await User.findOne({email});

        if (user) return res.status(400).json({message : "User with this email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
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
        res.status(200).json({message: "Logged out successfully"});
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

export {
    createAccount,
    login,
    logout,
    checkAuth,
}