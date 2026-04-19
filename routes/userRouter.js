import express from "express"
import { loginUser, registerUser } from "../controllers/authentication.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const userRouter=express.Router()


userRouter.post("/register", registerUser);
userRouter.get("/login",loginUser)
export default userRouter