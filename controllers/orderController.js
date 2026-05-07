import { orderModel } from "../models/orderModel.js";


const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can place orders" });
    }

    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products required" });
    }

    let totalPrice = 0;

    const safeProducts = products.map((item) => {
      if (!item.productId || !item.price) {
        throw new Error("Invalid product data");
      }

      totalPrice += item.price * item.quantity;

      return {
        productId: String(item.productId),
        source: item.source || "mongo", // ✅ FIX IMPORTANT
        title: item.title,
        image: item.image || "",
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
      };
    });

    const order = await orderModel.create({
      user: req.user.id,
      products: safeProducts,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// GET MY ORDERS
// ==============================
const getMyOrders = async (req, res, next) => {
  try {

    const orders = await orderModel.find({
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// GET ALL ORDERS
// ==============================
const getAllOrders = async (req, res, next) => {
  try {

    const orders = await orderModel.find();

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// UPDATE ORDER STATUS
// ==============================
const updateOrderStatus = async (req, res, next) => {
  try {

    const { status } = req.body;

    const validStatus = [
      "pending",
      "shipped",
      "delivered",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await orderModel.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated",
      order,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};


export {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};