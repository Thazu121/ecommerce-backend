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
      totalPrice += item.price * item.quantity;

      return {
        productId: String(item.productId),
        source: item.source || "mongo",
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

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ["pending", "shipped", "delivered"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated",
      order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};