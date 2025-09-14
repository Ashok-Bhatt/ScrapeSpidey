import jwt from "jsonwebtoken"
import { TOKEN_SECRET, NODE_ENV } from "../config.js";

export const generateToken = (userId, res) => {

    const token = jwt.sign(
        {userId},
        TOKEN_SECRET,
        { expiresIn : "15d" },
    );

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "Lax",
        secure: NODE_ENV == "production",
    })

    return token;
}