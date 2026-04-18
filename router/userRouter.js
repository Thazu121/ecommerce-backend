import { loginUser, registerUser } from "../controllers/authentication";


userRouter.post("/register", registerUser);
userRouter.get("/login",loginUser)
