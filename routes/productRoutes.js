import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import roleMiddleware  from "../middlewares/roleMiddleware.js"
import { createProduct, getAllProduct, getSingleProduct } from "../controllers/generation/productController.js"
const productrouter=express.Router()


productrouter.post("/create",authMiddleware,roleMiddleware("admin"),createProduct)
productrouter.get("/all",authMiddleware,getAllProduct)
productrouter.get("/:productId",authMiddleware,getSingleProduct)
productrouter.put("/:productId", authMiddleware, roleMiddleware("admin"), updateProduct)
export default productrouter