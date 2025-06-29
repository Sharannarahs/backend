import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controllers/messageControllers.js";

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessagesAsSeen); //put to update data
messageRouter.post("/send/:id", protectRoute, sendMessage);


export default messageRouter;