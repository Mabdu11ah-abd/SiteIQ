import express from "express";
import { recommendStack, improveStack } from "../controllers/techStackController.js"
const router = express.Router();


router.post("/recommend", recommendStack);
router.post("/improve", improveStack);


export default router;
    