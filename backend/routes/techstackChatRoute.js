// routes/techstackChatRoutes.js
import express from "express";
import { handleImproveChat, getMessagesByConversation } from "../controllers/techstackChatController.js";

const router = express.Router();


// Route to handle chat improvement (send message and get AI reply)
router.post("/chat", handleImproveChat);

// Route to fetch messages by conversationId
router.get("/chat/:conversationId", getMessagesByConversation);

export default router;
