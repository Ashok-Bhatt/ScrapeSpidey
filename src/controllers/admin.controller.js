import mongoose from "mongoose";
import User from "../models/user.model.js";

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

export {
    changeDailyApiLimit,
}