import  express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbconfig.js";

dotenv.config()
const app =express()
app.use(express.json())
app.use('/')
connectDB()


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
