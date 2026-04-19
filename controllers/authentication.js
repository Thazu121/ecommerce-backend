import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })

        }
                const emailLower = email.toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailLower)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" })
        }
        const existingUser = await userModel.findOne({email: emailLower })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await userModel.create({
            name: name,
            email: emailLower,
            password: hashedPassword,
            role: "user"
        })
        const userResponse = newuser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })

        }
        const emailLower = email.toLowerCase();
const user = await userModel.findOne({ email:emailLower });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });

        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }

        )
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login success",
            token,
            user: userResponse
        });


    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export {
    registerUser,
    loginUser
}