import express from "express";
//pull 3 controller functions that contain the logic for that route
import {register, login, logout, sendVerifyOtp, verifyEmail} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
//create mini app and mount under a path in main server
const authRouter = express.Router();

// /api/auth
//post endpoints
authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);

authRouter.post("/verify-account", userAuth, verifyEmail);

//export router so main server can see it
export default authRouter;
