import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from "../config.js";

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(ADMIN_PASSWORD, salt);

        const newAdmin = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            isAdmin: true,
        });

        await newAdmin.save();
        console.log("Admin seeded successfully.");
    } catch (error) {
        return handleError(res, error, "Error while seeding admin:");
    }
};

export default seedAdmin;
