import express from "express";
import {
    getAllWebsites,
    getWebsiteById
} from "../controllers/websiteController.js";

const router = express.Router();


// GET all websites for the user
router.get("/", getAllWebsites);

// GET one website by ID
router.get("/:id", getWebsiteById);

export default router;
