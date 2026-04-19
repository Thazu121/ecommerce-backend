// import { userModel } from "../models/userModel.js";
// import { productModel } from "../models/productModel.js";
// import { orderModel } from "../models/orderModel.js";

// const getAnalytics = async (req, res) => {
//     try {
//         const totalUsers = await userModel.countDocuments();

//         const totalProducts = await productModel.countDocuments();

//         const totalOrders = await orderModel.countDocuments();

//         const revenueData = await orderModel.aggregate([
//             {
//                 $group: {
//                     _id: null,
//                     totalRevenue: { $sum: "$totalPrice" }
//                 }
//             }
//         ]);

//         const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

//         res.status(200).json({
//             message: "Analytics data",
//             totalUsers,
//             totalProducts,
//             totalOrders,
//             totalRevenue
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export { getAnalytics };