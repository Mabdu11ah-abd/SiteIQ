//techstack user chats
import express from "express";
import {
  getUserChats,
  deleteUserChat,
  getChatHistory,
  addMessageToChat
} from "../controllers/userChatController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All user chat routes require authentication
router.get("/chats", authenticateJWT, getUserChats);
router.delete("/chats/:id", authenticateJWT, deleteUserChat);
router.get("/chats/:id", authenticateJWT, getChatHistory);
router.post("/chats/:id/messages", authenticateJWT, addMessageToChat);

export default router;
