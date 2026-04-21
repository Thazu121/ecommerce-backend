import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"



import {
  getProfile,
  updateProfile
} from "../controllers/userProfileController.js"

const userRouter = express.Router()




userRouter.get("/profile", authMiddleware, getProfile)
userRouter.put("/profile", authMiddleware, updateProfile)


export default userRouter;
