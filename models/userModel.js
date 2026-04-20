import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email"]


    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
    enum: ["admin", "user"],
      default: "user"
    }
  },
  { timestamps: true }
)

export const userModel = mongoose.model("users", userSchema)
