import { userModel } from "../models/userModel.js"
import bcrypt from "bcryptjs";

const getProfile = async (req, res, next) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        return res.status(200).json({
            message: "User profile",
            user
        });

    } catch (error) {
        next(error);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, address, password } = req.body;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        if (name) {
            if (name.trim().length === 0) {
                const err = new Error("Name cannot be empty");
                err.statusCode = 400;
                return next(err);
            }
            user.name = name.trim();
        }

        if (email) {
            const emailLower = email.toLowerCase().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailLower)) {
                const err = new Error("Invalid email");
                err.statusCode = 400;
                return next(err);
            }

            const existingUser = await userModel.findOne({ email: emailLower });

            if (existingUser && existingUser._id.toString() !== req.user.id) {
                const err = new Error("Email already in use");
                err.statusCode = 400;
                return next(err);
            }

            user.email = emailLower;
        }

        if (phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                const err = new Error("Invalid phone number");
                err.statusCode = 400;
                return next(err);
            }
            user.phone = phone;
        }

        if (address) {
            user.address = {
                street: address.street || user.address.street,
                city: address.city || user.address.city,
                pincode: address.pincode || user.address.pincode
            };
        }

        if (password) {
            if (password.length < 6) {
                const err = new Error("Password must be at least 6 characters");
                err.statusCode = 400;
                return next(err);
            }

            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Profile updated successfully",
            user: userResponse
        });

    } catch (error) {
        next(error);
    }
};


export {
    getProfile,
    updateProfile
}
