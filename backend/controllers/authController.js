
import bcrypt from "bcryptjs"; // used to hash and compare hashed passwords
import jwt from "jsonwebtoken"; // creates tokens that represent logged in users, stored in cookies or local storage
import userModel from "../models/userModels.js"; // mongoose model for users
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
            return res.json({success: false, message: "Invalid Email!"})
        }
            // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.json({success: false, message: "Invalid Password!"});
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