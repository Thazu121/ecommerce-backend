import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";


const getProfile = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: "User profile",
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, password } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) {
            user.name = name
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword;
        }

        await user.save()

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: "Profile updated successfully",
            user: userResponse
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


export {
    getProfile,
    updateProfile
};