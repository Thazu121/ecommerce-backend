import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct
} from "../controllers/productController.js";

const productrouter = express.Router()

productrouter.get("/filter/search", filterProduct)
productrouter.get("/", getAllProduct)
productrouter.get("/:productId", getSingleProduct)

productrouter.post("/", authMiddleware, roleMiddleware("admin"), createProduct)
productrouter.put("/:productId", authMiddleware, roleMiddleware("admin"), updateProduct)
productrouter.delete("/:productId", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default productrouter