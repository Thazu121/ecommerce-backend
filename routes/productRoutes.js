import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import roleMiddleware  from "../middlewares/roleMiddleware.js"
import { createProduct, getAllProduct } from "../controllers/generation/productController.js"
const productrouter=express.Router()


productrouter.post("/create",authMiddleware,roleMiddleware("admin"),createProduct)
productrouter.get("/",getAllProduct)
export default productrouter