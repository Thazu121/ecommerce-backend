import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js"

import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  filterProduct
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/filter", filterProduct);
productRouter.get("/", getAllProduct);
productRouter.get("/:productId", getSingleProduct);


productRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),   
  createProduct
);

productRouter.put(
  "/:productId",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),   
  updateProduct
);

productRouter.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProduct
);

export default productRouter;