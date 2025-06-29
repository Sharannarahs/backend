// this middleware function is executed before controller function
// auth.js to authenticate the user
// using middleware to protect the route so only when user is authenticated then only they can acces particular api end point
//to check profile or upload photo

import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token missing or invalid format" });
        }

        const token = authHeader.split(" ")[1]; // extracts the actual token


        const decoded = jwt.verify(token, process.env.JWT_SECRET); // gets user data by decoding like userID // decoded = { userId: "664f1b1736cbb2cf42fcb123", iat: ..., exp: ... } .//userId automatic generation
        console.log("Decoded JWT:", decoded);


        const user = await User.findById(decoded.userId).select("-password");
        /*
            {
            _id: "664f1b1736cbb2cf42fcb123",
            fullName: "Alice",
            email: "alice@example.com",
            bio: "Web dev",
            profilePic: "url.jpg"
            }
        */

        if(!user){
            return res.json({success: false, message:"User not found"});
        }

        req.user = user; //add user data in request and can use this data in controller

        next(); //controller function
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// for every api request we send token from frontend in headers

/*
Because you don't want everyone to access private data or perform actions (like uploading profile pictures, creating posts, etc.) without logging in.

So this middleware:

Checks if the request contains a valid JWT token.

Decodes the token to find the user.

If valid, lets the request continue.

If invalid/missing, it blocks access.

*/


