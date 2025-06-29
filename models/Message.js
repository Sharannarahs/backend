// model for messages

import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, default: false},


}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;


/*
This field senderId:

Stores a MongoDB ObjectId

That ObjectId refers to a document in the "User" collection

So you can later "populate" it to get full user info
*/


/*
USERS:
{
  "_id": "664f1b1736cbb2cf42fcb123",
  "fullName": "Alice",
  "email": "alice@example.com"
}

MESSAGES:
{
  "_id": "789f1b1736cbb2cf42fcb555",
  "senderId": "664f1b1736cbb2cf42fcb123",
  "text": "Hello, world!",
  "timestamp": "2024-06-23T10:00:00Z"
}

const messages = await Message.find().populate("senderId");

OUTPUT:

[
  {
    _id: "789...",
    text: "Hello, world!",
    senderId: {
      _id: "664...",
      fullName: "Alice",
      email: "alice@example.com"
    }
  }
]

*/
