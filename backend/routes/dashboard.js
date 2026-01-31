import express from "express";
import {
    getUserOverview,
    getUserWebsites,
    getUserChatHistory,
    getUserSeoRecommendations,
    getRecentTechStacks,
} from "../controllers/dashboardController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All dashboard routes require authentication
router.get("/overview", authenticateJWT, getUserOverview);
router.get("/websites", authenticateJWT, getUserWebsites);
router.get("/chat-history", authenticateJWT, getUserChatHistory);
router.get("/seo-recommendations", authenticateJWT, getUserSeoRecommendations);
router.get("/techstack", authenticateJWT, getRecentTechStacks);

export default router;
