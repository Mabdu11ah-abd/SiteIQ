// routes/chatRoutes.js

import express from "express";
import {
    handleChatMessage,
    getChatHistory,
    getChatMessage
} from "../controllers/chatController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All chat routes require authentication
router.post("/", authenticateJWT, handleChatMessage);
router.get("/:websiteId", authenticateJWT, getChatHistory);
router.get("/:websiteId/:index", authenticateJWT, getChatMessage);



export default router;
