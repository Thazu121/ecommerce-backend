import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/dbConnection.js";

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authenticationRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import adminrouter from "./routes/adminuserRouter.js";
import contactRouter from "./routes/contactRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://ecommerce-frontend-theta-bay.vercel.app",
    credentials: true,
  })
);


app.use("/uploads", express.static("uploads"));


app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/order", orderRouter);
app.use("/admin", adminrouter);
app.use("/contact", contactRouter);

app.use(errorHandler);


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});