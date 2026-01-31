// routes/techstackChatRoutes.js
import express from "express";
import { handleImproveChat, getMessagesByConversation } from "../controllers/techstackChatController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All tech stack chat routes require authentication
router.post("/chat", authenticateJWT, handleImproveChat);
router.get("/chat/:conversationId", authenticateJWT, getMessagesByConversation);

export default router;
