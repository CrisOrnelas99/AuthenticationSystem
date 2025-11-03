import express from "express";
//pull 3 controller functions that contain the logic for that route
import {register, login, logout} from "../controllers/authController.js";
//create mini app and mount under a path in main server
const authRouter = express.Router();

// /api/auth
//post endpoints
authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);
//export router so main server can see it
export default authRouter;
