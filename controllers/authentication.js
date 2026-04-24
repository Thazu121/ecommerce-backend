import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const registerUser = async (req, res, next) => {
    try {
        let { name, email, password, address, phone, role } = req.body

        if (!name || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" })
        }

        name = name.trim()
        email = email.trim().toLowerCase()
        name = name.trim();

        if (name.length < 3) {
            return res.status(400).json({
                message: "Name must contain at least 3 characters"
            });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters with uppercase, lowercase, and number"
            });
        }

        if (phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: "Phone must be 10 digits"
                });
            }
        }

        if (address) {
            const { street, city, pincode } = address;

            if (!street || !city || !pincode) {
                return res.status(400).json({
                    message: "Address must include street, city, pincode"
                });
            }

            const pincodeRegex = /^[0-9]{6}$/;
            if (!pincodeRegex.test(pincode)) {
                return res.status(400).json({
                    message: "Pincode must be 6 digits"
                });
            }
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role
        })


        const userResponse = newUser.toObject()
        delete userResponse.password

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse
        })

    } catch (err) {
        next(err)
    }
}


const loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        email = email.trim().toLowerCase()

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }


        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        if (!process.env.JWT_SECRET) {
            const err = new Error("Server configuration error")
            err.statusCode = 500
            return next(err)
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        const userResponse = user.toObject()
        delete userResponse.password

        return res.status(200).json({
            message: "Login success",
            token,
            user: userResponse
        })

    } catch (err) {
        next(err)
    }
}


export {
    registerUser,
    loginUser
}
