import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
const registerUser = async (req, res, next) => {
  try {
    let {
      name,
      email,
      password,
      address,
      phone,
      role,
    } = req.body;

    // REQUIRED
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // CLEAN
    name = name.trim();
    email = email.trim().toLowerCase();

    // NAME VALIDATION
    if (name.length < 3) {
      return res.status(400).json({
        message:
          "Name must contain at least 3 characters",
      });
    }

    // EMAIL VALIDATION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // PASSWORD VALIDATION
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase and number",
      });
    }

    // PHONE VALIDATION
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Phone must be 10 digits",
        });
      }
    }

    // ADDRESS VALIDATION
    if (address) {
      const { street, city, pincode } =
        address;

      if (!street || !city || !pincode) {
        return res.status(400).json({
          message:
            "Address must include street, city and pincode",
        });
      }

      const pincodeRegex = /^[0-9]{6}$/;

      if (!pincodeRegex.test(pincode)) {
        return res.status(400).json({
          message: "Pincode must be 6 digits",
        });
      }
    }

    // EXISTING USER
    const existingUser =
      await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role || "user",
    });

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // REMOVE PASSWORD
    const userResponse = newUser.toObject();

    delete userResponse.password;

    // RESPONSE
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });

  } catch (err) {
    next(err);
  }
};

// ================= LOGIN =================
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(200).json({
      message: "Login success",
      token,
      user: userResponse,
    });

  } catch (err) {
    next(err);
  }
};

export {
  registerUser,
  loginUser,
};