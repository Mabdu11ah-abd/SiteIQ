// routes/websiteHistoryRoutes.js
import express from 'express';
import {
  createHistory,
  getUserHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
} from "../controllers/history.controller.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All history routes require authentication
router.post('/', authenticateJWT, createHistory);
router.get('/', authenticateJWT, getUserHistory);
router.get('/:id', authenticateJWT, getHistoryById);
router.put('/:id', authenticateJWT, updateHistory);
router.delete('/:id', authenticateJWT, deleteHistory);


export default router;
