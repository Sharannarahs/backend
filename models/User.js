import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //Login.jsx

    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    
    //profile.jsx
    profilePic: {type: String, default: ""}, //String since stores url of profile picture
    bio: {type: String},
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;