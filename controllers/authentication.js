import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

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
        return res.status(201).json({
            message: "User registered successfully", user: newuser
        })
    } catch (err) {
        return res.status(500).json({ message: "server error" })

    }
}