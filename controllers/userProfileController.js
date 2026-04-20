import { userModel } from "../models/userModel.js"
import bcrypt from "bcryptjs";


const getProfile = async (req, res, next) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password")

          if (!user) {
            const err = new Error("User not found")
            err.statusCode = 404
            throw err
        }

        return res.status(200).json({
            message: "User profile",
            user
        })

    } catch (error) {
        next(error)
    }
};


const updateProfile = async (req, res, next) => {
    try {
        const { name, password } = req.body

        const user = await userModel.findById(req.user.id)

           if (!user) {
            const err = new Error("User not found")
            err.statusCode = 404
            throw err
        }


        if (name) {
            if (name.trim().length === 0) {
                return res.status(400).json({ message: "Name cannot be empty" })
            }
            user.name = name.trim();
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
        }

        await user.save()

        user.password = undefined;

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};


export {
    getProfile,
    updateProfile
}
