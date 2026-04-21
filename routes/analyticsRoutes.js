import express from "express";
import { getRecommendedProducts } from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js"


const analyticRouter = express.Router()

analyticRouter.get("/", authMiddleware, getRecommendedProducts)

export default analyticRouter;
