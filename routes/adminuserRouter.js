import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { getAllUsers } from "../controllers/userController.js"

const adminrouter = express.Router();

// ✅ ADMIN ONLY ROUTE
adminrouter.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

export default adminrouter;