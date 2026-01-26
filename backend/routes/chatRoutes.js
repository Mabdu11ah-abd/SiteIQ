// routes/chatRoutes.js

import express from "express";
import {
    handleChatMessage,
    getChatHistory,
    getChatMessage
} from "../controllers/chatController.js";

const router = express.Router();

// — send a new message & AI reply
router.post("/",  handleChatMessage);

// — fetch the entire chat history array
router.get("/:websiteId",  getChatHistory);

// — fetch a single message by its index
router.get("/:websiteId/:index",  getChatMessage);



export default router;
