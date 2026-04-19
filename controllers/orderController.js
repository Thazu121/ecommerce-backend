import { orderModel } from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";

const createOrder = async (req, res) => {
    try {
        const { products } = req.body

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products are required" })
        }

        let totalPrice = 0

        for (let item of products) {
            const { productId, quantity } = item

            const product = await productModel.findById(productId)

            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }

            totalPrice += product.price * quantity
        }

        const order = await orderModel.create({
            user: req.user.id,
            products,
            totalPrice,
        })

        res.status(201).json({
            message: "Order created successfully",
            order,
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await orderModel
            .find({ user: userId })
            .populate("products.productId") 
            .populate("user", "name email")

res.status(200).json({
    message: "My orders",
    orders
})

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find()
            .populate("products.productId")
            .populate("user", "name email");

        res.status(200).json({
            message: "All orders",
            orders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { 
    createOrder,getMyOrders
,getAllOrders }