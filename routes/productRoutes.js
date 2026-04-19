import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import roleMiddleware  from "../middlewares/roleMiddleware.js"
import { createProduct } from "../controllers/generation/productController.js"
const productrouter=express.Router()
productrouter.post("/",authMiddleware,roleMiddleware("admin"),createProduct)

export default productrouter