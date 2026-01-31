// routes/seoReportRoutes.js
import express from 'express';
import {
  analyzeWebsite,
  getReport,
  getAllReports,
  updateReport,
  deleteReport
} from '../controllers/lightHouse.controller.js';
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

// All lighthouse routes require authentication
router.post('/analyze', authenticateJWT, analyzeWebsite);
router.get('/', authenticateJWT, getAllReports);
router.get('/:id', authenticateJWT, getReport);
router.put('/:id', authenticateJWT, updateReport);
router.delete('/:id', authenticateJWT, deleteReport);

export default router;
