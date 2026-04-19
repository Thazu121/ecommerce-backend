import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })

        }
        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ message: "Invalid email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" })
        }
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        newuser.password = undefined
        return res.status(201).json({
            message: "User registered successfully", user: newuser
        })
    } catch (err) {
        return res.status(500).json({ message: "server error" })

    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })

        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });

        }
        const token = jwt.sign({
            id: user._id,
             name: user.name,
             role:user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }

        )
        user.password = undefined;

        return res.status(200).json({
            message: "Login success",
            token,
            user
        });


    }
    catch (error) {
        return res.status(500).json({ message: "server error" });

    }
}

export {
    registerUser,
    loginUser
}