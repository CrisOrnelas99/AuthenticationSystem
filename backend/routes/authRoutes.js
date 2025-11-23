import express from "express";
//pull 3 controller functions that contain the logic for that route
import {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp, resetPassword
} from "../controllers/authController.js";
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

authRouter.get("/is-auth", userAuth, isAuthenticated);

authRouter.post("/send-reset-otp", sendResetOtp);

authRouter.post("/reset-password", resetPassword);

//export router so main server can see it
export default authRouter;
