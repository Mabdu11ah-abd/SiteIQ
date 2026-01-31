import express from "express";
import { getUserProfile, updateUserProfile, deleteUser, getUserSeoReports, getUserSubscription } from "../controllers/userController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All user routes require authentication
router.get("/profile", authenticateJWT, getUserProfile);
router.put("/profile", authenticateJWT, updateUserProfile);
router.delete("/", authenticateJWT, deleteUser);
router.get("/seo-reports", authenticateJWT, getUserSeoReports);
router.get("/subscription", authenticateJWT, getUserSubscription);

export default router;
