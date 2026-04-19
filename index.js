import  express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConnection.js";
import userRouter from "./router/userRouter.js"
import productrouter from "./routes/productRoutes.js";

dotenv.config()
const app =express()
app.use(express.json())
app.use('/user',userRouter)
app.use("/products",productRoutes)
connectDB()


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
