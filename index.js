import  express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConnection.js";
import userrouter from "./routes/userRouter.js"
import productrouter from "./routes/productRoutes.js";
import authrouter from "./routes/authenticationRoute.js"
import orderrouter from "./routes/orderRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config()
const app =express()
app.use(express.json())
app.use('/auth',authrouter)
app.use('/user',userrouter)
app.use("/products",productrouter)
app.use("/order",orderrouter)
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
