
import bcrypt from "bcryptjs"; // used to hash and compare hashed passwords
import jwt from "jsonwebtoken"; // creates tokens that represent logged in users, stored in cookies or local storage
import userModel from "../models/userModels.js"; // mongoose model for users
import transporter from "../config/nodemailer.js";
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from "../config/emailTemplates.js";
//signup new users
export const register = async (req, res)=> {
        //extracts data sent by the client from the request body
    const {name, email, password} = req.body;
        //if any field is empty, it sends an error message
    if (!name || !email || !password){
        return res.json({success: false, message: "Missing Details"});
    }
    try{
            //looks for matching email in the mongoDB
        const existingUser = await userModel.findOne({email});
            //error if found a matching email
        if (existingUser){
            return res.json({success: false, message: "User already exists"})
        }
            //hashes the password, the more salt rounds the stronger but slower
        const hashedPassword = await bcrypt.hash(password, 10);
            // creates a new user object using my schema
        const user = new userModel({name, email, password: hashedPassword});
            //stores to mongoDB database
        await user.save();

            //creates a JSON web token, that encodes user id, secret key, and expiration date
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
            //sends a cookie to the browser that stores the token safely
        res.cookie("token", token, {
            httpOnly: true, // javascript in browser can't read this cookie, prevents hacking
            secure: process.env.NODE_ENV === "production",  // only end cookie over HTTPS(in production)
            sameSite: process.env.NODE_ENV === "production" //helps prevent Cross-Site Request Forgery
                ? "none" : "strict",
            maxAge: 7*24*60*60*1000 //how long the cookie lasts
        });
        //send welcome email
        const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to TEST",
            text: `Welcome to TEST website. Your account
                    has been created with email id: ${email}`
        }
        //sends email using transporter
        await transporter.sendMail(mailOptions);

            //tells the frontend that the registration worked
        return res.json({success: true});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

    //login existing users
export const login = async(req, res)=>{
        //get input and validate
    const {email, password} = req.body;
    if (!email || !password){
        return res.json({success: false, message: "Email and Password are required!"});
    }

    try{
            //check if user exists
        const user = await userModel.findOne({email});

        if (!user){
            return res.json({success: false, message: "Invalid Email or Password!"})
        }
            // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.json({success: false, message: "Invalid Email or Password!"});
        }
        //create and send token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true});
    }
    catch(error){
        return res.json({success: false, message: error.message});

    }
}

    //log out user
export const logout = async(req, res)=>{

    try{
            //deletes the authentication cookie, logging the user out
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none" : "strict",
        })

        return res.json({success: true, message: "Logged Out"});
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}

//send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;
        //fetch user from database
        const user = await userModel.findById(userId);
        //block if already verified
        if (user.isAccountVerified){
            return res.json({success: false, message: "Account Already verified"});
        }
        //create 6 digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        //expire in 24 hours
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            //text: `Your OTP is ${otp}. Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        //send email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Verification OTP sent to Email" });
    }
    catch(error){
        res.json({ success: false, message: error.message });
    }
}

//get OTP and verify user account
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    //fail if no user Id or OTP in req message
    if (!userId || !otp) {
        return res.json({success: false, message: "Missing Details"});
    }
    try{
        //fetch ID from database
        const user = await userModel.findById(userId);

        if (!user){
            return res.json({success: false, message: "User not found"});
        }
        //OTP must exist
        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }
        //check expiration
        if (user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }
        //verify and invalidate OTP
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Email verified successfully"});
    }
    catch(error){
        return res.json({success: false, message: "Email verification Failed"});
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try{

        return res.json({success: true})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

//send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if (!email){
        return res.json({success: false, message: "Email is required"});
    }
    try{
        // If a user is logged in, ensure they are resetting their own email
        let loggedInUserId = null;
        if (req.cookies?.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                loggedInUserId = decoded?.id;
            } catch (e) {
                // ignore token errors for unauthenticated reset flows
            }
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        if (loggedInUserId && user._id.toString() !== loggedInUserId) {
            return res.json({success: false, message: "Email mismatch"});
        }
        //create 6 digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        //expire in 24 hours
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Reset OTP",
            // Insert both otp and email placeholders
            html: PASSWORD_RESET_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        }
        //send email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset OTP sent to Email" });
    }

    catch(error){
        return res.json({success: false, message: error.message})
    }
}

// reset user password
export const resetPassword = async (req, res) => {
    const {email, otp, newPass} = req.body;
    if (!email || !otp || !newPass){
        return res.json({success: false, message: "Missing information"});
    }
    try{
        // If a user is logged in, ensure they are resetting their own email
        let loggedInUserId = null;
        if (req.cookies?.token) {
            try {
                const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
                loggedInUserId = decoded?.id;
            } catch (e) {
                // ignore token errors for unauthenticated reset flows
            }
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        if (loggedInUserId && user._id.toString() !== loggedInUserId) {
            return res.json({success: false, message: "Email mismatch"});
        }
        if (user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"})
        }
        if (user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"})
        }
        const hashedPassword = await bcrypt.hash(newPass, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();
        res.json({success: true, message: "Password has been reset successfully"});
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}
