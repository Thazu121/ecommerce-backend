import { orderModel } from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";


const createOrder = async (req, res, next) => {
    try {
        const { products } = req.body

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products are required" })
        }

        let totalPrice = 0;

        for (let item of products) {
            const { productId, quantity } = item;

            if (!productId) {
                return res.status(400).json({ message: "Product ID is required" });
            }

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            const product = await productModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            totalPrice += product.price * quantity;
        }

        const order = await orderModel.create({
            user: req.user.id,
            products,
            totalPrice,
        });

        return res.status(201).json({
            message: "Order created successfully",
            order,
        });

    } catch (error) {
        next(error);
    }
};


const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const orders = await orderModel
            .find({ user: userId })
            .populate("products.productId")
            .populate("user", "name email");

        return res.status(200).json({
            message: "My orders",
            orders,
        });

    } catch (error) {
        next(error);
    }
};


const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderModel
            .find()
            .populate("products.productId")
            .populate("user", "name email");

        return res.status(200).json({
            message: "All orders",
            orders,
        });

    } catch (error) {
        next(error);
    }
};


const updateOrderStatus = async (req, res, next) => {
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

        return res.status(200).json({
            message: "Order status updated",
            order,
        });

    } catch (error) {
        next(error);
    }
};


export {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
