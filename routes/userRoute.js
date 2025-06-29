// TO CREATE API END POINTS FOR ALL CONTROLLERS

import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login",login);
userRouter.put("/update-profile", protectRoute, updateProfile); // MIDDLEWARE USED HERE SINCE AUTHENTICATED USERS ONLY CAN UPDATE PROFILE
userRouter.get("/check", protectRoute, checkAuth); //check if user is authenticated or not.

export default userRouter;