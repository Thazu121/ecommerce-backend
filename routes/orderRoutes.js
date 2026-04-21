import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router()


orderRouter.post("/", authMiddleware,roleMiddleware("user"), createOrder)
orderRouter.get("/my", authMiddleware,roleMiddleware("user"), getMyOrders)


orderRouter.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders)
orderRouter.put("/:id", authMiddleware, roleMiddleware("admin"), updateOrderStatus)


export default orderRouter;
