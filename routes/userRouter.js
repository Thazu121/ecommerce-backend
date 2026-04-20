import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"



import {
  getProfile,
  updateProfile
} from "../controllers/userProfileController.js"

const userrouter = express.Router()




userrouter.get("/profile", authMiddleware, getProfile)
userrouter.put("/profile", authMiddleware, updateProfile)


export default userrouter;
