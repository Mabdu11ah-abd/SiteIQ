import express from "express";
import { recommendStack, improveStack } from "../controllers/techStackController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// Tech stack routes require authentication
router.post("/recommend", authenticateJWT, recommendStack);
router.post("/improve", authenticateJWT, improveStack);


export default router;
    