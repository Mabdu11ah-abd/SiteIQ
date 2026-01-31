import express from "express";
import {
    getAllWebsites,
    getWebsiteById
} from "../controllers/websiteController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All website routes require authentication
router.get("/", authenticateJWT, getAllWebsites);
router.get("/:id", authenticateJWT, getWebsiteById);

export default router;
