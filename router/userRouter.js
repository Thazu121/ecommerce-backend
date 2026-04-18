import { loginUser, registerUser } from "../controllers/authentication";
import { authMiddleware } from "../middlewares/authMiddleware";


userRouter.post("/register", registerUser);
userRouter.get("/login",authMiddleware, loginUser)
