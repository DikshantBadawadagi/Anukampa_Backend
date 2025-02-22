import User from "../models/User.js";
import ApiError from "../error.js";

export const ensureUserExists = async (req, res, next) => {
    try {
        let userId = req.cookies?.access_token;

        if (userId) {
            const existingUser = await User.findById(userId);
            if (existingUser) {
                req.user = existingUser; 
                return next(); 
            }
        }

        const newUser = await User.createUser(); 

        res.cookie("access_token", newUser._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date("9999-12-31"),
        });

        req.user = newUser; 
        next(); 

    } catch (error) {
        next(error);
        // next(new ApiError(500, "Error ensuring user existence", error.errors || []));
    }
};