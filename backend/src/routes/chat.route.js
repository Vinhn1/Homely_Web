import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getConversations, getMessages, sendMessage, getOrCreateConversation } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/", protect, getConversations);
chatRouter.post("/send", protect, sendMessage);
chatRouter.get("/messages/:conversationId", protect, getMessages);
chatRouter.get("/conversation/:userId", protect, getOrCreateConversation); // userId is the user to chat with

export default chatRouter;
