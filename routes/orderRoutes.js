import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const orderrouter = express.Router();


orderrouter.post("/", authMiddleware, createOrder);
orderrouter.get("/my", authMiddleware, getMyOrders);


orderrouter.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);
orderrouter.put("/:id", authMiddleware, roleMiddleware("admin"), updateOrderStatus);


export default orderrouter;
