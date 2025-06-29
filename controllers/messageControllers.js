

// GET ALL USERS EXCEPT LOGGED IN USERS:

import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js"

export const getUsersForSidebar = async (req, res) => {
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        //count number of messages not seen
        const unseenMessage = {}

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessage[user._id] = messages.length; //user._id is the key //creates key value pair //The key is the user._id (i.e. the sender's ID). //The value is the number of unseen messages sent by that user to the currently logged-in user.
            }
        })

        await Promise.all(promises); //await promise.all since map is loop and need to run for all.
        res.json({success: true, users: filteredUsers, unseenMessage});
    
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }

}

/*unseenMessages = {}

{
  "u1": 2,
  "u2": 0,
  "u3": 5
}

*/

// GET ALL MESSAGES FOR SELECTED USERS:

export const getMessages = async (req, res) => {
    try{
        const {id: selectedUserId} = req.params; //This line extracts the selected user’s ID from the route URL //the person you're chatting with.
        const myId = req.user._id;

        const messages = await Message.find({ // Retrieves all messages exchanged between the two users. // Marks all messages from the other user as seen.


            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});
        res.json({success: true, messages})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// api to mark message as seen using message id

export const markMessagesAsSeen = async(req , res) =>{
    try{
        const {id} = req.params; // This line uses JavaScript destructuring to extract the id parameter from the URL route parameters. GET /api/messages/665123abc7890  // req.params = { id: "665123abc7890" };

        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

// Send messages to selected users.

export const sendMessage = async (req, res) => {
    
    try{
        const {text, image} = req.body;
        const receiverId  = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image) // If an image is attached, uploads it to Cloudinary and stores the URL.
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit new message to the receivers socket

        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage); //"newMessage" custom event name // message 'to' and 'emit' newMessage
         }



        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}