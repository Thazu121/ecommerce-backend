import  express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConnection.js";
import userRouter from "./routes/userRouter.js"
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authenticationRoute.js"
import orderRouter from "./routes/orderRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import analyticRouter from "./routes/analyticsRoutes.js";

dotenv.config()
const app =express()
app.use(express.json())
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use("/products",productRouter)
app.use("/order",orderRouter)
app.use("/analytics", analyticRouter);

app.use(errorHandler)



const PORT = process.env.PORT || 5000;
connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
