import { productModel } from "../models/productModel.js";
import { orderModel } from "../models/orderModel.js";

const getRecommendedProducts = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const orders = await orderModel
            .find({ user: userId })
            .populate("products.productId");

        if (!orders.length) {
            const products = await productModel.find().limit(5);

            return res.status(200).json({
                message: "No orders found, showing random products",
                products
            });
        }

        let categories = [];

        orders.forEach(order => {
            order.products.forEach(item => {
                if (item.productId?.category) {
                    categories.push(item.productId.category);
                }
            });
        });

        categories = [...new Set(categories)];

        const recommendedProducts = await productModel.find({
            category: { $in: categories }
        }).limit(5);

        return res.status(200).json({
            message: "Recommended products",
            products: recommendedProducts
        });

    } catch (error) {
        next(error);
    }
};

export { getRecommendedProducts }
