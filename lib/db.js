import mongoose, { mongo } from "mongoose";

// Function to connect to the mongodb database

export const connectDB = async () =>{
    try{

        mongoose.connection.on('connected', ()=> console.log("Database Connected")); //Event listener

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`) //chat-app name of DB

    } catch (error){
        console.log(error);
    }
}

//use this function in server.js
